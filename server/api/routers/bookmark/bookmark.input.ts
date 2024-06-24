import { z } from "zod";

export const ListBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export const GetBookmarkSchema = z.object({
  id: z.string(),
});

export const CreateBookmarkSchema = z.object({
  url: z.string().url(),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const UpdateBookmarkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
});

export const DeleteBookmarkSchema = z.object({
  id: z.string(),
});

export const MyBookmarksSchema = z.object({
  page: z.number().int().default(1),
  perPage: z.number().int().default(12),
});

export type ListBookmarksInput = z.infer<typeof ListBookmarksSchema>;
export type GetBookmarkInput = z.infer<typeof GetBookmarkSchema>;
export type CreateBookmarkInput = z.infer<typeof CreateBookmarkSchema>;
export type UpdateBookmarkInput = z.infer<typeof UpdateBookmarkSchema>;
export type DeleteBookmarkInput = z.infer<typeof DeleteBookmarkSchema>;
export type MyBookmarksInput = z.infer<typeof MyBookmarksSchema>;
