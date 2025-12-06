import { z } from "zod";

export const createWarehouseSchema = z.object({
  outletId: z.string().uuid(),
  name: z.string().min(1),
  code: z.string().optional(),
  type: z.string().optional()
});

export type CreateWarehouseDto = z.infer<typeof createWarehouseSchema>;