import { z } from "zod";

export const createUnitSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().optional(),
  code: z.string().optional()
});

export type CreateUnitDto = z.infer<typeof createUnitSchema>;