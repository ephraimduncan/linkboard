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
import { bookmarks } from "~/server/db/schema";
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
    with: { user: { columns: { email: true } } },
  });
};

export const getBookmark = async (ctx: ProtectedTRPCContext, { id }: GetBookmarkInput) => {
  return ctx.db.query.bookmarks.findFirst({
    where: (table, { eq }) => eq(table.id, id),
    with: { user: { columns: { email: true } } },
  });
};

export const createBookmark = async (ctx: ProtectedTRPCContext, input: CreateBookmarkInput) => {
  const id = generateId(15);

  await ctx.db.insert(bookmarks).values({
    id,
    userId: ctx.user.id,
    url: input.url,
    title: input.title,
    description: input.description,
    isPublic: input.isPublic,
  });

  return { id };
};

export const updateBookmark = async (ctx: ProtectedTRPCContext, input: UpdateBookmarkInput) => {
  const [item] = await ctx.db
    .update(bookmarks)
    .set({
      url: input.url,
      title: input.title,
      description: input.description,
      isPublic: input.isPublic,
    })
    .where(eq(bookmarks.id, input.id))
    .returning();

  return item;
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
  });
};
