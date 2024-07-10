import { TRPCError } from "@trpc/server";
import { and, eq, not } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { ProtectedTRPCContext } from "../../trpc";
import type { GetUserProfileInput, UpdateUserInput } from "./user.input";

export const updateUser = async (
  ctx: ProtectedTRPCContext,
  input: UpdateUserInput,
) => {
  return await ctx.db.transaction(async (trx) => {
    if (input.username) {
      const existingUsername = await trx.query.users.findFirst({
        where: and(
          eq(users.username, input.username),
          not(eq(users.id, ctx.user.id)),
        ),
      });

      if (existingUsername) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already taken.",
        });
      }
    }

    const [updatedUser] = await trx
      .update(users)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(users.id, ctx.user.id))
      .returning();

    if (!updatedUser) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return updatedUser;
  });
};

export const getUserProfile = async (
  ctx: ProtectedTRPCContext,
  input: GetUserProfileInput,
) => {
  try {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, input.userId),
      columns: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while fetching the user profile",
    });
  }
};
