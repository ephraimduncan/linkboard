import { ResultSet } from "@libsql/client";
import { TRPCError } from "@trpc/server";
import { ExtractTablesWithRelations, and, eq } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { JSDOM } from "jsdom";
import { generateId } from "lucia";
import { redis } from "~/lib/redis";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import { bookmarkTags, bookmarks, tags } from "~/server/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  CachedBookmarkInput,
  CreateBookmarkInput,
  DeleteBookmarkInput,
  GetBookmarkInput,
  GetPublicBookmarksInput,
  MyBookmarksInput,
  RefetchBookmarkInput,
  ToggleBookmarkVisibilityInput,
  UpdateBookmarkInput,
} from "./bookmark.input";

export const getPublicBookmarks = async (input: GetPublicBookmarksInput) => {
  return db.query.bookmarks.findMany({
    where: (table, { eq }) => eq(table.isPublic, true),
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.updatedAt),
    columns: {
      id: true,
      url: true,
      title: true,
      description: true,
      isPublic: true,
      createdAt: true,
      updatedAt: true,
    },
    with: {
      user: {
        columns: {
          email: true,
          username: true,
          id: true,
          name: true,
        },
      },
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  });
};

export const getBookmark = async (
  ctx: ProtectedTRPCContext,
  { id }: GetBookmarkInput,
) => {
  return ctx.db.query.bookmarks.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: {
      user: { columns: { email: true } },
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  });
};

export const getOrFetchBookmarkData = async (
  url: string,
): Promise<CachedBookmarkInput> => {
  const cachedData = await redis.get(url);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const response = await fetch(url).catch((error) => {
    console.error("Error fetching bookmark data:", error);
    throw new Error("Failed to fetch bookmark data");
  });

  const html = await response.text();
  const dom = new JSDOM(html);
  const title =
    dom.window.document.title ||
    dom.window.document.querySelector("title")?.textContent ||
    "";
  const description =
    dom.window.document
      .querySelector("meta[name='description']")
      ?.getAttribute("content") || "";

  const bookmarkData: CachedBookmarkInput = { title, description };
  await redis.set(url, JSON.stringify(bookmarkData));

  return bookmarkData;
};

export const createBookmark = async (
  ctx: ProtectedTRPCContext,
  input: CreateBookmarkInput,
) => {
  return await ctx.db.transaction(async (trx) => {
    const existingBookmark = await trx.query.bookmarks.findFirst({
      where: and(
        eq(bookmarks.userId, ctx.user.id),
        eq(bookmarks.url, input.url),
      ),
    });

    if (existingBookmark) {
      await trx
        .update(bookmarks)
        .set({ updatedAt: new Date() })
        .where(eq(bookmarks.id, existingBookmark.id));

      await updateBookmarkTags(trx, existingBookmark.id, input.tags);

      return { id: existingBookmark.id };
    }

    const bookmarkId = generateId(15);
    const { title, description } = await getOrFetchBookmarkData(input.url);

    await trx.insert(bookmarks).values({
      id: bookmarkId,
      userId: ctx.user.id,
      url: input.url,
      title,
      description,
      isPublic: input.isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await updateBookmarkTags(trx, bookmarkId, input.tags);

    return { id: bookmarkId };
  });
};

const updateBookmarkTags = async (
  trx: SQLiteTransaction<
    "async",
    ResultSet,
    typeof schema,
    ExtractTablesWithRelations<typeof schema>
  >,
  bookmarkId: string,
  newTagNames: string[],
) => {
  const existingBookmarkTags = await trx.query.bookmarkTags.findMany({
    where: eq(bookmarkTags.bookmarkId, bookmarkId),
    with: { tag: true },
  });

  const existingTagNames = new Set(
    existingBookmarkTags.map((bt) => bt.tag.name),
  );
  const tagsToAdd = newTagNames.filter((tag) => !existingTagNames.has(tag));

  for (const tagName of tagsToAdd) {
    let tag = await trx.query.tags.findFirst({
      where: eq(tags.name, tagName),
    });

    if (!tag) {
      const tagId = generateId(15);
      await trx.insert(tags).values({
        id: tagId,
        name: tagName,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      tag = {
        id: tagId,
        name: tagName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    await trx.insert(bookmarkTags).values({
      id: generateId(15),
      bookmarkId: bookmarkId,
      tagId: tag.id,
    });
  }
};

export const updateBookmark = async (
  ctx: ProtectedTRPCContext,
  input: UpdateBookmarkInput,
) => {
  await ctx.db.transaction(async (trx) => {
    await trx
      .update(bookmarks)
      .set({
        url: input.url,
        title: input.title,
        description: input.description,
        isPublic: input.isPublic,
        updatedAt: new Date(),
      })
      .where(eq(bookmarks.id, input.id));

    await trx.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, input.id));

    for (const tagName of input.tags) {
      let tag = await trx.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      if (!tag) {
        const tagId = generateId(15);
        await trx.insert(tags).values({
          id: tagId,
          name: tagName,
        });
        tag = {
          id: tagId,
          name: tagName,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }

      await trx.insert(bookmarkTags).values({
        id: generateId(15),
        bookmarkId: input.id,
        tagId: tag.id,
      });
    }
  });

  const updatedBookmark = await ctx.db.query.bookmarks.findFirst({
    where: eq(bookmarks.id, input.id),
    with: {
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  });

  return updatedBookmark;
};

export const deleteBookmark = async (
  ctx: ProtectedTRPCContext,
  input: DeleteBookmarkInput,
) => {
  try {
    return await ctx.db.transaction(async (trx) => {
      const bookmark = await trx.query.bookmarks.findFirst({
        where: and(
          eq(bookmarks.id, input.id),
          eq(bookmarks.userId, ctx.user.id),
        ),
      });

      if (!bookmark) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Bookmark not found or you do not have permission to delete it",
        });
      }

      await trx
        .delete(bookmarkTags)
        .where(eq(bookmarkTags.bookmarkId, input.id));
      const [deletedBookmark] = await trx
        .delete(bookmarks)
        .where(eq(bookmarks.id, input.id))
        .returning();

      return {
        success: true,
        deletedBookmark,
        message: "Bookmark successfully deleted",
      };
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    console.error("Error deleting bookmark:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while deleting the bookmark ",
    });
  }
};

export const myBookmarks = async (
  ctx: ProtectedTRPCContext,
  input: MyBookmarksInput,
) => {
  return ctx.db.query.bookmarks.findMany({
    where: (table, { eq }) => eq(table.userId, ctx.user.id),
    offset: (input.page - 1) * input.perPage,
    limit: input.perPage,
    orderBy: (table, { desc }) => desc(table.createdAt),
    columns: {
      id: true,
      url: true,
      title: true,
      description: true,
      isPublic: true,
      createdAt: true,
    },
    with: {
      tags: {
        columns: {},
        with: {
          tag: true,
        },
      },
    },
  });
};

export const refetchBookmark = async (
  ctx: ProtectedTRPCContext,
  input: RefetchBookmarkInput,
) => {
  const bookmark = await ctx.db.query.bookmarks.findFirst({
    where: (table, { eq }) => eq(table.id, input.id),
  });

  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  try {
    const response = await fetch(bookmark.url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const newTitle =
      dom.window.document.title ||
      dom.window.document.querySelector("title")?.textContent ||
      "";
    const newDescription =
      dom.window.document
        .querySelector("meta[name='description']")
        ?.getAttribute("content") || "";

    const newCacheData: CachedBookmarkInput = {
      title: newTitle,
      description: newDescription,
    };
    await redis.set(bookmark.url, JSON.stringify(newCacheData));

    const [updatedBookmark] = await ctx.db
      .update(bookmarks)
      .set({
        title: newTitle,
        description: newDescription,
        updatedAt: new Date(),
      })
      .where(eq(bookmarks.id, input.id))
      .returning();

    return updatedBookmark;
  } catch (error) {
    console.error("Error refetching bookmark:", error);
    throw new Error("Failed to refetch bookmark");
  }
};

export const toggleBookmarkVisibility = async (
  ctx: ProtectedTRPCContext,
  input: ToggleBookmarkVisibilityInput,
) => {
  const bookmark = await ctx.db.query.bookmarks.findFirst({
    where: (table, { eq }) => eq(table.id, input.id),
  });

  if (!bookmark) {
    throw new Error("Bookmark not found");
  }

  // Ensure the user owns the bookmark
  if (bookmark.userId !== ctx.user.id) {
    throw new Error("You do not have permission to modify this bookmark");
  }

  const [updatedBookmark] = await ctx.db
    .update(bookmarks)
    .set({
      isPublic: !bookmark.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(bookmarks.id, input.id))
    .returning();

  return updatedBookmark;
};
