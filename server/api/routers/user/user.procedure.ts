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
});
