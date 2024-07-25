import { z } from "zod";

export const GetPublicBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(25),
  search: z.string().optional(),
});

export const GetBookmarkSchema = z.object({
  id: z.string(),
});

export const CreateBookmarkSchema = z.object({
  url: z.string().url(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  favicon: z.string().url().optional(),
  image: z.string().url().optional(),
});

export const UpdateBookmarkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  favicon: z.string().url().optional(),
  image: z.string().url().optional(),
});

export const DeleteBookmarkSchema = z.object({
  id: z.string(),
});

export const MyBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(25),
  search: z.string().optional(),
});

export const RefetchBookmarkSchema = z.object({
  id: z.string(),
});

export const ToggleBookmarkVisibilitySchema = z.object({
  id: z.string(),
});

export const CachedBookmarkSchema = z.object({
  title: z.string(),
  description: z.string(),
  favicon: z.string().url().optional(),
  image: z.string().url().optional(),
});

export const GetBookmarksByTagSchema = z.object({
  tagName: z.string().min(1).max(50),
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
});

export type GetPublicBookmarksInput = z.infer<typeof GetPublicBookmarksSchema>;
export type GetBookmarkInput = z.infer<typeof GetBookmarkSchema>;
export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof UpdateBookmarkSchema>;
export type DeleteBookmarkInput = z.infer<typeof DeleteBookmarkSchema>;
export type MyBookmarksInput = z.infer<typeof MyBookmarksSchema>;
export type RefetchBookmarkInput = z.infer<typeof RefetchBookmarkSchema>;
export type ToggleBookmarkVisibilityInput = z.infer<
  typeof RefetchBookmarkSchema
>;
export type CachedBookmarkInput = z.infer<typeof CachedBookmarkSchema>;
export type GetBookmarksByTagInput = z.infer<typeof GetBookmarksByTagSchema>;
