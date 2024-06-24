import { generateId } from "lucia";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  CreateBookmarkInput,
  DeleteBookmarkInput,
  GetBookmarkInput,
  ListBookmarksInput,
  MyBookmarksInput,
  UpdateBookmarkInput,
} from "./bookmark.input";
import { bookmarks, bookmarkTags, tags } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
    // Insert the bookmark
    await trx.insert(bookmarks).values({
      id: bookmarkId,
      userId: ctx.user.id,
      url: input.url,
      title: input.title,
      description: input.description,
      isPublic: input.isPublic,
    });

    // Process tags
    for (const tagName of input.tags) {
      // Check if the tag already exists
      let tag = await trx.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      // If the tag doesn't exist, create it
      if (!tag) {
        const tagId = generateId(15);
        await trx.insert(tags).values({
          id: tagId,
          name: tagName,
        });
        tag = { id: tagId, name: tagName, createdAt: new Date(), updatedAt: new Date() };
      }

      // Create the bookmark-tag association
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
    // Update the bookmark
    await trx
      .update(bookmarks)
      .set({
        url: input.url,
        title: input.title,
        description: input.description,
        isPublic: input.isPublic,
      })
      .where(eq(bookmarks.id, input.id));

    // Remove existing tag associations
    await trx.delete(bookmarkTags).where(eq(bookmarkTags.bookmarkId, input.id));

    // Process new tags
    for (const tagName of input.tags) {
      // Check if the tag already exists
      let tag = await trx.query.tags.findFirst({
        where: eq(tags.name, tagName),
      });

      // If the tag doesn't exist, create it
      if (!tag) {
        const tagId = generateId(15);
        await trx.insert(tags).values({
          id: tagId,
          name: tagName,
        });
        tag = { id: tagId, name: tagName, createdAt: new Date(), updatedAt: new Date() };
      }

      // Create the bookmark-tag association
      await trx.insert(bookmarkTags).values({
        id: generateId(15),
        bookmarkId: input.id,
        tagId: tag.id,
      });
    }
  });

  // Fetch and return the updated bookmark
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

export const deleteBookmark = async (ctx: ProtectedTRPCContext, { id }: DeleteBookmarkInput) => {
  const [item] = await ctx.db.delete(bookmarks).where(eq(bookmarks.id, id)).returning();
  return item;
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
