import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./collection.input";
import * as services from "./collection.service";

export const collectionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(inputs.CreateCollectionSchema)
    .mutation(({ ctx, input }) => services.createCollection(ctx, input)),

  get: protectedProcedure
    .input(inputs.GetCollectionSchema)
    .query(({ ctx, input }) => services.getCollection(ctx, input)),

  update: protectedProcedure
    .input(inputs.UpdateCollectionSchema)
    .mutation(({ ctx, input }) => services.updateCollection(ctx, input)),

  delete: protectedProcedure
    .input(inputs.DeleteCollectionSchema)
    .mutation(({ ctx, input }) => services.deleteCollection(ctx, input)),

  addBookmark: protectedProcedure
    .input(inputs.AddBookmarkToCollectionSchema)
    .mutation(({ ctx, input }) => services.addBookmarkToCollection(ctx, input)),

  removeBookmark: protectedProcedure
    .input(inputs.RemoveBookmarkFromCollectionSchema)
    .mutation(({ ctx, input }) =>
      services.removeBookmarkFromCollection(ctx, input),
    ),
});
