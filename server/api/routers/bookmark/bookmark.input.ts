import { z } from "zod";

export const ListBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type ListBookmarksInput = z.infer<typeof ListBookmarksSchema>;

export const GetBookmarkSchema = z.object({
  id: z.string(),
});
export type GetBookmarkInput = z.infer<typeof GetBookmarkSchema>;

export const CreateBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(false),
});
export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;

export const updateBookmarkSchema = CreateBookmarkSchema.extend({
  id: z.string(),
});
export type UpdateBookmarkInput = z.infer<typeof updateBookmarkSchema>;

export const DeleteBookmarkSchema = z.object({
  id: z.string(),
});
export type DeleteBookmarkInput = z.infer<typeof DeleteBookmarkSchema>;

export const MyBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});
export type MyBookmarksInput = z.infer<typeof MyBookmarksSchema>;
