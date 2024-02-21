import { z } from "zod";

export const createTagSchema = z.object({
  title: z.string().min(3, { message: "Minimum 3 characters." }),
});

export type CreateTagSchema = z.infer<typeof createTagSchema>;
