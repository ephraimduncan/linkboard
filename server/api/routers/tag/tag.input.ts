import { z } from "zod";

export const GetTagsSchema = z.object({
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(20),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
});

export const DeleteTagSchema = z.object({
  id: z.string(),
});

export const UpdateTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50),
});

export type GetTagsInput = z.infer<typeof GetTagsSchema>;
export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type DeleteTagInput = z.infer<typeof DeleteTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;
