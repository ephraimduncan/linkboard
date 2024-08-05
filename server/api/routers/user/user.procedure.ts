import { createTRPCRouter, protectedProcedure } from "../../trpc";
import * as inputs from "./user.input";
import * as services from "./user.service";

export const userRouter = createTRPCRouter({
  updateProfile: protectedProcedure
    .input(inputs.UpdateUserSchema)
    .mutation(({ ctx, input }) => services.updateUser(ctx, input)),

  getProfile: protectedProcedure
    .input(inputs.GetUserProfileSchema)
    .query(({ ctx, input }) => services.getUserProfile(ctx, input)),

  getUserProfileByUsername: protectedProcedure
    .input(inputs.GetUserProfileByUsernameSchema)
    .query(({ ctx, input }) => services.getUserProfileByUsername(ctx, input)),

  getUserBookmarksAndCollections: protectedProcedure
    .input(inputs.GetUserBookmarksAndCollectionsSchema)
    .query(({ ctx, input }) =>
      services.getUserBookmarksAndCollections(ctx, input),
    ),
});
