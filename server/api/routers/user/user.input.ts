import { z } from "zod";

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(255).optional(),
  name: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
});

export const GetUserProfileSchema = z.object({
  userId: z.string(),
});

export const GetUserProfileByUsernameSchema = z.object({
  username: z.string(),
});

export const GetUserBookmarksAndCollectionsSchema = z.object({
  username: z.string(),
  bookmarkPage: z.number().int().positive().default(1),
  bookmarkPerPage: z.number().int().positive().default(10),
  collectionPage: z.number().int().positive().default(1),
  collectionPerPage: z.number().int().positive().default(10),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUserProfileInput = z.infer<typeof GetUserProfileSchema>;
export type GetProfileByUsernameInput = z.infer<
  typeof GetUserProfileByUsernameSchema
>;
export type GetUserBookmarksAndCollectionsInput = z.infer<
  typeof GetUserBookmarksAndCollectionsSchema
>;
