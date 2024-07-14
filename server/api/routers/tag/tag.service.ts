import { TRPCError } from "@trpc/server";
import { eq, like } from "drizzle-orm";
import { generateId } from "lucia";
import { db } from "~/server/db";
import { tags } from "~/server/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
  CreateTagInput,
  DeleteTagInput,
  GetTagsInput,
  UpdateTagInput,
} from "./tag.input";

export const getTags = async (
  ctx: ProtectedTRPCContext,
  input: GetTagsInput,
) => {
  return db.query.tags.findMany({
    where: input.search ? like(tags.name, `%${input.search}%`) : undefined,
    limit: input.limit,
    orderBy: (table, { asc }) => asc(table.name),
  });
};

export const createTag = async (
  ctx: ProtectedTRPCContext,
  input: CreateTagInput,
) => {
  const existingTag = await db.query.tags.findFirst({
    where: eq(tags.name, input.name),
  });

  if (existingTag) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A tag with this name already exists",
    });
  }

  const tagId = generateId(15);
  const [newTag] = await db
    .insert(tags)
    .values({
      id: tagId,
      name: input.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return newTag;
};

export const deleteTag = async (
  ctx: ProtectedTRPCContext,
  input: DeleteTagInput,
) => {
  const [deletedTag] = await db
    .delete(tags)
    .where(eq(tags.id, input.id))
    .returning();

  if (!deletedTag) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tag not found",
    });
  }

  return { success: true, deletedTag };
};

export const updateTag = async (
  ctx: ProtectedTRPCContext,
  input: UpdateTagInput,
) => {
  const existingTag = await db.query.tags.findFirst({
    where: eq(tags.name, input.name),
  });

  if (existingTag && existingTag.id !== input.id) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "A tag with this name already exists",
    });
  }

  const [updatedTag] = await db
    .update(tags)
    .set({
      name: input.name,
      updatedAt: new Date(),
    })
    .where(eq(tags.id, input.id))
    .returning();

  if (!updatedTag) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Tag not found",
    });
  }

  return updatedTag;
};
