import { z } from "zod";

export const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
});

export const GetCollectionSchema = z.object({
  id: z.string(),
});

export const GetUserCollectionsSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(20),
  search: z.string().optional(),
});

export const UpdateCollectionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean(),
});

export const DeleteCollectionSchema = z.object({
  id: z.string(),
});

export const AddBookmarkToCollectionSchema = z.object({
  collectionId: z.string(),
  bookmarkId: z.string(),
});

export const RemoveBookmarkFromCollectionSchema = z.object({
  collectionId: z.string(),
  bookmarkId: z.string(),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;
export type GetCollectionInput = z.infer<typeof GetCollectionSchema>;
export type GetUserCollectionsInput = z.infer<typeof GetUserCollectionsSchema>;
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionSchema>;
export type DeleteCollectionInput = z.infer<typeof DeleteCollectionSchema>;
export type AddBookmarkToCollectionInput = z.infer<
  typeof AddBookmarkToCollectionSchema
>;
export type RemoveBookmarkFromCollectionInput = z.infer<
  typeof RemoveBookmarkFromCollectionSchema
>;
