import { z } from "zod";

export const getInventorySchema = z.object({
  warehouseId: z.string().uuid()
});

export const stockAdjustLineSchema = z.object({
  variantId: z.string().uuid(),
  qtyDiff: z.number().refine((n) => n !== 0, { message: "qtyDiff cannot be 0" }),
  unitCost: z.number().nonnegative().optional()
});

export const adjustStockSchema = z.object({
  warehouseId: z.string().uuid(),
  note: z.string().optional(),
  lines: z.array(stockAdjustLineSchema).min(1)
});

export type GetInventoryParamsDto = z.infer<typeof getInventorySchema>;
export type StockAdjustLineDto = z.infer<typeof stockAdjustLineSchema>;
export type AdjustStockDto = z.infer<typeof adjustStockSchema>;