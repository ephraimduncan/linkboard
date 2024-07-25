import { ResultSet } from "@libsql/client";
import { TRPCError } from "@trpc/server";
import { ExtractTablesWithRelations, and, eq, like, or } from "drizzle-orm";
import { SQLiteTransaction } from "drizzle-orm/sqlite-core";
import { JSDOM } from "jsdom";
import { generateId } from "lucia";
import { redis } from "~/lib/redis";
import { db } from "~/server/db";
import * as schema from "~/server/db/schema";
import {
  bookmarkCollections,
  bookmarkTags,
  bookmarks,
  tags,
} from "~/server/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  CachedBookmarkInput,
  CreateBookmarkInput,
  DeleteBookmarkInput,
  GetBookmarkInput,
  GetBookmarksByTagInput,
  GetPublicBookmarksInput,
  MyBookmarksInput,
  RefetchBookmarkInput,
  ToggleBookmarkVisibilityInput,
  UpdateBookmarkInput,
} from "./bookmark.input";

async function fetchPage({ url }: { url: string }): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Error fetching page:", error);
    throw new Error("Failed to fetch page");
  }
}

export const getOrFetchBookmarkData = async (
  url: string,
): Promise<CachedBookmarkInput> => {
  const cachedData = await redis.get(url);
  let bookmarkData: CachedBookmarkInput | null = null;

  if (cachedData) {
    bookmarkData = JSON.parse(cachedData);
    if (bookmarkData?.favicon && bookmarkData?.image) {
      return bookmarkData;
    }
  }

  try {
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const { document } = dom.window;

    const getMetaContent = (selector: string): string | null => {
      const element = document.querySelector(selector);
      return element ? element.getAttribute("content") : null;
    };

    const title = document.title || "";
    const description = getMetaContent('meta[name="description"]') || "";
    const image = getMetaContent('meta[property="og:image"]') || "";

    let favicon =
      document.querySelector('link[rel="icon"]')?.getAttribute("href") ||
      document
        .querySelector('link[rel="shortcut icon"]')
        ?.getAttribute("href") ||
      "/favicon.ico";

    if (favicon && !favicon.startsWith("http")) {
      const baseUrl = new URL(url);
      favicon = new URL(favicon, baseUrl.origin).toString();
    }

    if (bookmarkData) {
      bookmarkData = {
        ...bookmarkData,
        favicon: bookmarkData.favicon || favicon,
        image: bookmarkData.image || image,
      };
    } else {
      bookmarkData = {
        title,
        description,
        image,
        favicon,
      };
    }

    await redis.set(url, JSON.stringify(bookmarkData));

    return bookmarkData;
  } catch (error) {
    console.error("Error fetching bookmark data:", error);
    // If we have partial cached data, return it instead of throwing an error
    if (bookmarkData) {
      return bookmarkData;
    }
    throw new Error("Failed to fetch bookmark data");
  }
};
export const getPublicBookmarks = async (input: GetPublicBookmarksInput) => {
  return db.query.bookmarks.findMany({
    where: (table, { eq, or, like }) =>
      and(
        eq(table.isPublic, true),
        input.search
          ? or(
              like(table.url, `%${input.search}%`),
              like(table.title, `%${input.search}%`),
            )
          : undefined,
      ),
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

    const { title, description, image, favicon } = await getOrFetchBookmarkData(
      input.url,
    );

    await trx.insert(bookmarks).values({
      id: bookmarkId,
      userId: ctx.user.id,
      url: input.url,
      title,
      description,
      image,
      favicon,
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
      await trx
        .delete(bookmarkCollections)
        .where(eq(bookmarkCollections.bookmarkId, input.id));

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
    where: (table, { eq, or, like }) =>
      and(
        eq(table.userId, ctx.user.id),
        input.search
          ? or(
              like(table.url, `%${input.search}%`),
              like(table.title, `%${input.search}%`),
            )
          : undefined,
      ),
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
    const {
      title: newTitle,
      description: newDescription,
      image: newImage,
      favicon: newFavicon,
    } = await getOrFetchBookmarkData(bookmark.url);

    const [updatedBookmark] = await ctx.db
      .update(bookmarks)
      .set({
        title: newTitle,
        description: newDescription,
        image: newImage,
        favicon: newFavicon,
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

export const getBookmarksByTag = async (input: GetBookmarksByTagInput) => {
  const tag = await db.query.tags.findFirst({
    where: eq(tags.name, input.tagName),
  });

  if (!tag) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tag not found",
    });
  }

  const bookmarks = await db
    .select({
      id: schema.bookmarks.id,
      url: schema.bookmarks.url,
      title: schema.bookmarks.title,
      description: schema.bookmarks.description,
      isPublic: schema.bookmarks.isPublic,
      createdAt: schema.bookmarks.createdAt,
      updatedAt: schema.bookmarks.updatedAt,
      userId: schema.bookmarks.userId,
    })
    .from(schema.bookmarks)
    .innerJoin(bookmarkTags, eq(schema.bookmarks.id, bookmarkTags.bookmarkId))
    .where(
      and(
        eq(bookmarkTags.tagId, tag.id),
        input.search
          ? or(
              like(schema.bookmarks.url, `%${input.search}%`),
              like(schema.bookmarks.title, `%${input.search}%`),
              like(schema.bookmarks.description, `%${input.search}%`),
            )
          : undefined,
      ),
    )
    .limit(input.perPage)
    .offset((input.page - 1) * input.perPage);

  const bookmarksWithTags = await Promise.all(
    bookmarks.map(async (bookmark) => {
      const tags = await db.query.bookmarkTags.findMany({
        where: eq(bookmarkTags.bookmarkId, bookmark.id),
        with: {
          tag: true,
        },
      });

      const user = await db.query.users.findFirst({
        where: eq(schema.users.id, bookmark.userId),
        columns: {
          id: true,
          name: true,
          email: true,
          username: true,
        },
      });

      return {
        ...bookmark,
        tags,
        user,
      };
    }),
  );

  return bookmarksWithTags;
};
