import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./bookmark.input";
import * as services from "./bookmark.service";

export const bookmarkRouter = createTRPCRouter({
  list: protectedProcedure
    .input(inputs.ListBookmarksSchema)
    .query(({ ctx, input }) => services.listBookmarks(ctx, input)),

  get: protectedProcedure.input(inputs.GetBookmarkSchema).query(({ ctx, input }) => services.getBookmark(ctx, input)),

  create: protectedProcedure
    .input(inputs.CreateBookmarkSchema)
    .mutation(({ ctx, input }) => services.createBookmark(ctx, input)),

  update: protectedProcedure
    .input(inputs.UpdateBookmarkSchema)
    .mutation(({ ctx, input }) => services.updateBookmark(ctx, input)),

  delete: protectedProcedure
    .input(inputs.DeleteBookmarkSchema)
    .mutation(async ({ ctx, input }) => services.deleteBookmark(ctx, input)),

  myBookmarks: protectedProcedure
    .input(inputs.MyBookmarksSchema)
    .query(({ ctx, input }) => services.myBookmarks(ctx, input)),
});
