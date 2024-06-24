import { generateId } from "lucia";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  CreateBookmarkInput,
  DeleteBookmarkInput,
  GetBookmarkInput,
  ListBookmarksInput,
  MyBookmarksInput,
  RefetchBookmarkInput,
  ToggleBookmarkVisibilityInput,
  UpdateBookmarkInput,
} from "./bookmark.input";
import { bookmarks, bookmarkTags, tags } from "~/server/db/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { JSDOM } from "jsdom";
import { TRPCError } from "@trpc/server";

export const listBookmarks = async (ctx: ProtectedTRPCContext, input: ListBookmarksInput) => {
  return ctx.db.query.bookmarks.findMany({
    where: (table, { eq }) => eq(table.isPublic, true),
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

export const getBookmark = async (ctx: ProtectedTRPCContext, { id }: GetBookmarkInput) => {
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

export const createBookmark = async (ctx: ProtectedTRPCContext, input: CreateBookmarkInput) => {
  const bookmarkId = generateId(15);

  await ctx.db.transaction(async (trx) => {
    const response = await fetch(input.url);
    const html = await response.text();

    const dom = new JSDOM(html);
    const title = dom.window.document.title || document.querySelector("title")?.textContent || "";
    const description = dom.window.document.querySelector("meta[name='description']")?.getAttribute("content") || "";

    await trx.insert(bookmarks).values({
      id: bookmarkId,
      userId: ctx.user.id,
      url: input.url,
      title,
      description,
      isPublic: input.isPublic,
    });

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
        tag = { id: tagId, name: tagName, createdAt: new Date(), updatedAt: new Date() };
      }

      await trx.insert(bookmarkTags).values({
        id: generateId(15),
        bookmarkId: bookmarkId,
        tagId: tag.id,
      });
    }
  });

  return { id: bookmarkId };
};

export const updateBookmark = async (ctx: ProtectedTRPCContext, input: UpdateBookmarkInput) => {
  await ctx.db.transaction(async (trx) => {
    await trx
      .update(bookmarks)
      .set({
        url: input.url,
        title: input.title,
        description: input.description,
        isPublic: input.isPublic,
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
        tag = { id: tagId, name: tagName, createdAt: new Date(), updatedAt: new Date() };
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

export const deleteBookmark = async (ctx: ProtectedTRPCContext, input: DeleteBookmarkInput) => {
  try {
    return await ctx.db.transaction(async (trx) => {
      const bookmark = await trx.query.bookmarks.findFirst({
        where: and(eq(bookmarks.id, input.id), eq(bookmarks.userId, ctx.user.id)),
      });

      if (!bookmark) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Bookmark not found or you do not have permission to delete it",
        });
      }

      await trx.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, input.id));
      const [deletedBookmark] = await trx.delete(bookmarks).where(eq(bookmarks.id, input.id)).returning();

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

export const myBookmarks = async (ctx: ProtectedTRPCContext, input: MyBookmarksInput) => {
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

export const refetchBookmark = async (ctx: ProtectedTRPCContext, input: RefetchBookmarkInput) => {
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
    const newTitle = dom.window.document.title || dom.window.document.querySelector("title")?.textContent || "";
    const newDescription = dom.window.document.querySelector("meta[name='description']")?.getAttribute("content") || "";

    const [updatedBookmark] = await ctx.db
      .update(bookmarks)
      .set({
        title: newTitle,
        description: newDescription,
      })
      .where(eq(bookmarks.id, input.id))
      .returning();

    return updatedBookmark;
  } catch (error) {
    console.error("Error refetching bookmark:", error);
    throw new Error("Failed to refetch bookmark");
  }
};

export const toggleBookmarkVisibility = async (ctx: ProtectedTRPCContext, input: ToggleBookmarkVisibilityInput) => {
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
    })
    .where(eq(bookmarks.id, input.id))
    .returning();

  return updatedBookmark;
};
