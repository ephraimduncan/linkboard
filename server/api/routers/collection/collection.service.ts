import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";
import { db } from "~/server/db";
import { bookmarkCollections, collections, users } from "~/server/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  AddBookmarkToCollectionInput,
  CreateCollectionInput,
  DeleteCollectionInput,
  GetCollectionInput,
  GetUserCollectionByUsernameInput,
  GetUserCollectionsInput,
  RemoveBookmarkFromCollectionInput,
  UpdateCollectionInput,
} from "./collection.input";

export const createCollection = async (
  ctx: ProtectedTRPCContext,
  input: CreateCollectionInput,
) => {
  const collectionId = generateId(15);

  const [collection] = await ctx.db
    .insert(collections)
    .values({
      id: collectionId,
      userId: ctx.user.id,
      name: input.name,
      description: input.description,
      isPublic: input.isPublic,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return collection;
};

export const getCollection = async (
  ctx: ProtectedTRPCContext,
  input: GetCollectionInput,
) => {
  const collection = await ctx.db.query.collections.findFirst({
    where: and(
      eq(collections.id, input.id),
      eq(collections.userId, ctx.user.id),
    ),
    with: {
      bookmarks: {
        with: {
          bookmark: {
            with: {
              tags: {
                with: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!collection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found",
    });
  }

  return collection;
};

export const getUserCollectionByUsername = async (
  input: GetUserCollectionByUsernameInput,
) => {
  const user = await db.query.users.findFirst({
    where: eq(users.username, input.username),
  });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });
  }

  const collection = await db.query.collections.findFirst({
    where: and(
      eq(collections.id, input.id),
      eq(collections.userId, user.id),
      eq(collections.isPublic, true),
    ),
    with: {
      bookmarks: {
        with: {
          bookmark: {
            with: {
              tags: {
                with: {
                  tag: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!collection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found",
    });
  }

  return collection;
};

export const getUserCollections = async (
  ctx: ProtectedTRPCContext,
  input: GetUserCollectionsInput,
) => {
  const { page, perPage, search } = input;

  return await ctx.db.query.collections.findMany({
    where: (collections, { and, eq, like }) =>
      and(
        eq(collections.userId, ctx.user.id),
        search ? like(collections.name, `%${search}%`) : undefined,
      ),
    offset: (page - 1) * perPage,
    limit: perPage,
    orderBy: (collections, { desc }) => [desc(collections.updatedAt)],
    with: {
      bookmarks: {
        with: {
          bookmark: {
            columns: {
              id: true,
              favicon: true,
              url: true,
              title: true,
            },
          },
        },
      },
    },
  });
};

export const updateCollection = async (
  ctx: ProtectedTRPCContext,
  input: UpdateCollectionInput,
) => {
  const [updatedCollection] = await ctx.db
    .update(collections)
    .set({
      name: input.name,
      description: input.description,
      isPublic: input.isPublic,
      updatedAt: new Date(),
    })
    .where(
      and(eq(collections.id, input.id), eq(collections.userId, ctx.user.id)),
    )
    .returning();

  if (!updatedCollection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found or you don't have permission to update it",
    });
  }

  return updatedCollection;
};

// export const deleteCollection = async (
//   ctx: ProtectedTRPCContext,
//   input: DeleteCollectionInput,
// ) => {
//   // First, delete all bookmark associations
//   await ctx.db
//     .delete(bookmarkCollections)
//     .where(eq(bookmarkCollections.collectionId, input.id));

//   // Then, delete the collection
//   const [deletedCollection] = await ctx.db
//     .delete(collections)
//     .where(
//       and(eq(collections.id, input.id), eq(collections.userId, ctx.user.id)),
//     )
//     .returning();

//   if (!deletedCollection) {
//     throw new TRPCError({
//       code: "NOT_FOUND",
//       message: "Collection not found or you don't have permission to delete it",
//     });
//   }

//   return { success: true, message: "Collection deleted successfully" };
// };

export const deleteCollection = async (
  ctx: ProtectedTRPCContext,
  input: DeleteCollectionInput,
) => {
  return await ctx.db.transaction(async (trx) => {
    await trx
      .delete(bookmarkCollections)
      .where(eq(bookmarkCollections.collectionId, input.id));

    const [deletedCollection] = await trx
      .delete(collections)
      .where(
        and(eq(collections.id, input.id), eq(collections.userId, ctx.user.id)),
      )
      .returning();

    if (!deletedCollection) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message:
          "Collection not found or you don't have permission to delete it",
      });
    }

    return {
      success: true,
      deletedCollection,
      message: "Collection deleted successfully",
    };
  });
};

export const addBookmarkToCollection = async (
  ctx: ProtectedTRPCContext,
  input: AddBookmarkToCollectionInput,
) => {
  // Check if the collection exists and belongs to the user
  const collection = await ctx.db.query.collections.findFirst({
    where: and(
      eq(collections.id, input.collectionId),
      eq(collections.userId, ctx.user.id),
    ),
  });

  if (!collection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found or you don't have permission to modify it",
    });
  }

  // Check if the bookmark is already in the collection
  const existingAssociation = await ctx.db.query.bookmarkCollections.findFirst({
    where: and(
      eq(bookmarkCollections.collectionId, input.collectionId),
      eq(bookmarkCollections.bookmarkId, input.bookmarkId),
    ),
  });

  if (existingAssociation) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Bookmark is already in the collection",
    });
  }

  // Add the bookmark to the collection
  const [association] = await ctx.db
    .insert(bookmarkCollections)
    .values({
      id: generateId(15),
      collectionId: input.collectionId,
      bookmarkId: input.bookmarkId,
    })
    .returning();

  return association;
};

export const removeBookmarkFromCollection = async (
  ctx: ProtectedTRPCContext,
  input: RemoveBookmarkFromCollectionInput,
) => {
  // Check if the collection exists and belongs to the user
  const collection = await ctx.db.query.collections.findFirst({
    where: and(
      eq(collections.id, input.collectionId),
      eq(collections.userId, ctx.user.id),
    ),
  });

  if (!collection) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Collection not found or you don't have permission to modify it",
    });
  }

  // Remove the bookmark from the collection
  const [removedAssociation] = await ctx.db
    .delete(bookmarkCollections)
    .where(
      and(
        eq(bookmarkCollections.collectionId, input.collectionId),
        eq(bookmarkCollections.bookmarkId, input.bookmarkId),
      ),
    )
    .returning();

  if (!removedAssociation) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Bookmark was not found in the collection",
    });
  }

  return {
    success: true,
    message: "Bookmark removed from collection successfully",
  };
};
