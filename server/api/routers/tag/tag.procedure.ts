import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./tag.input";
import * as services from "./tag.service";

export const tagRouter = createTRPCRouter({
  getTags: protectedProcedure
    .input(inputs.GetTagsSchema)
    .query(({ ctx, input }) => services.getTags(ctx, input)),

  create: protectedProcedure
    .input(inputs.CreateTagSchema)
    .mutation(({ ctx, input }) => services.createTag(ctx, input)),

  delete: protectedProcedure
    .input(inputs.DeleteTagSchema)
    .mutation(({ ctx, input }) => services.deleteTag(ctx, input)),

  update: protectedProcedure
    .input(inputs.UpdateTagSchema)
    .mutation(({ ctx, input }) => services.updateTag(ctx, input)),
});
