import { z } from "zod";

export const createOutletSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
});

export type CreateOutletDto = z.infer<typeof createOutletSchema>;