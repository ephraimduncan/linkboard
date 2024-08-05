import { TRPCError } from "@trpc/server";
import { and, eq, not, sql } from "drizzle-orm";
import { db } from "~/server/db";
import { bookmarks, collections, users } from "~/server/db/schema";
import { ProtectedTRPCContext } from "../../trpc";
import type {
  GetProfileByUsernameInput,
  GetUserBookmarksAndCollectionsInput,
  GetUserProfileInput,
  UpdateUserInput,
} from "./user.input";

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

export const getUserProfileByUsername = async (
  ctx: ProtectedTRPCContext,
  input: GetProfileByUsernameInput,
) => {
  try {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.username, input.username),
      columns: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return null;
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

export const getUserBookmarksAndCollections = async (
  input: GetUserBookmarksAndCollectionsInput,
) => {
  try {
    return await db.transaction(async (trx) => {
      // Find the user by username
      const user = await trx.query.users.findFirst({
        where: eq(users.username, input.username),
        columns: {
          id: true,
          username: true,
          name: true,
          avatar: true,
          bio: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Fetch bookmarks
      const userBookmarks = await trx.query.bookmarks.findMany({
        where: and(eq(bookmarks.userId, user.id), eq(bookmarks.isPublic, true)),
        limit: input.bookmarkPerPage,
        offset: (input.bookmarkPage - 1) * input.bookmarkPerPage,
        orderBy: (bookmarks, { desc }) => [desc(bookmarks.createdAt)],
        with: {
          tags: {
            columns: {},
            with: {
              tag: true,
            },
          },
        },
      });

      const [{ count: totalBookmarks }] = await trx
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(bookmarks)
        .where(
          and(eq(bookmarks.userId, user.id), eq(bookmarks.isPublic, true)),
        );

      const userCollections = await trx.query.collections.findMany({
        where: and(
          eq(collections.userId, user.id),
          eq(collections.isPublic, true),
        ),
        limit: input.collectionPerPage,
        offset: (input.collectionPage - 1) * input.collectionPerPage,
        orderBy: (collections, { desc }) => [desc(collections.createdAt)],
      });

      const [{ count: totalCollections }] = await trx
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(collections)
        .where(
          and(eq(collections.userId, user.id), eq(collections.isPublic, true)),
        );

      return {
        user,
        bookmarks: {
          items: userBookmarks,
          total: Number(totalBookmarks),
        },
        collections: {
          items: userCollections,
          total: Number(totalCollections),
        },
      };
    });
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }
    console.error("Error fetching user bookmarks and collections:", error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while fetching user data",
    });
  }
};
