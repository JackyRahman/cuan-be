import { z } from "zod";

export const createProductSchema = z.object({
  categoryId: z.string().uuid().optional(),
  brandId: z.string().uuid().optional(),
  name: z.string().min(1),
  code: z.string().optional(),
  description: z.string().optional(),
  isService: z.boolean().optional()
});

export const createVariantSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().optional(),
  sku: z.string().optional(),
  unitId: z.string().uuid().optional(),
  costPrice: z.number().nonnegative().optional(),
  sellPrice: z.number().nonnegative().optional()
});

export const addBarcodeSchema = z.object({
  variantId: z.string().uuid(),
  barcode: z.string().min(1),
  isPrimary: z.boolean().optional()
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type CreateVariantDto = z.infer<typeof createVariantSchema>;
export type AddBarcodeDto = z.infer<typeof addBarcodeSchema>;