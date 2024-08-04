import { z } from "zod";

export const UpdateUserSchema = z.object({
  username: z.string().min(3).max(255).optional(),
  name: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
});

export const GetUserProfileSchema = z.object({
  userId: z.string(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type GetUserProfileInput = z.infer<typeof GetUserProfileSchema>;
