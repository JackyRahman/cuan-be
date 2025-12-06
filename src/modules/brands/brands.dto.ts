import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional()
});

export type CreateBrandDto = z.infer<typeof createBrandSchema>;