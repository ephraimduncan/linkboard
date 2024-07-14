import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc";
import * as inputs from "./bookmark.input";
import * as services from "./bookmark.service";

export const bookmarkRouter = createTRPCRouter({
  getPublicBookmarks: publicProcedure
    .input(inputs.GetPublicBookmarksSchema)
    .query(({ input }) => services.getPublicBookmarks(input)),

  get: protectedProcedure
    .input(inputs.GetBookmarkSchema)
    .query(({ ctx, input }) => services.getBookmark(ctx, input)),

  create: protectedProcedure
    .input(inputs.CreateBookmarkSchema)
    .mutation(({ ctx, input }) => services.createBookmark(ctx, input)),

  update: protectedProcedure
    .input(inputs.UpdateBookmarkSchema)
    .mutation(({ ctx, input }) => services.updateBookmark(ctx, input)),

  delete: protectedProcedure
    .input(inputs.DeleteBookmarkSchema)
    .mutation(({ ctx, input }) => services.deleteBookmark(ctx, input)),

  myBookmarks: protectedProcedure
    .input(inputs.MyBookmarksSchema)
    .query(({ ctx, input }) => services.myBookmarks(ctx, input)),

  refetch: protectedProcedure
    .input(inputs.RefetchBookmarkSchema)
    .mutation(({ ctx, input }) => services.refetchBookmark(ctx, input)),

  toggleVisibility: protectedProcedure
    .input(inputs.ToggleBookmarkVisibilitySchema)
    .mutation(({ ctx, input }) =>
      services.toggleBookmarkVisibility(ctx, input),
    ),

  getBookmarksByTag: protectedProcedure
    .input(inputs.GetBookmarksByTagSchema)
    .query(({ ctx, input }) => services.getBookmarksByTag(ctx, input)),
});
