import { Response } from "express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { AuthRequest } from "../../common/types/express";
import {
  addBarcode,
  createProduct,
  createVariant,
  listProducts
} from "./products.service";
import { addBarcodeSchema, createProductSchema, createVariantSchema } from "./products.dto";

export const createProductHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const product = await createProduct({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, product, "Product created", 201);
};

export const listProductsHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const products = await listProducts(req.user.companyId);
  return sendSuccess(res, products);
};

export const createVariantHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createVariantSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const variant = await createVariant(parsed.data);
  return sendSuccess(res, variant, "Variant created", 201);
};

export const addBarcodeHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = addBarcodeSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const barcode = await addBarcode(parsed.data);
  return sendSuccess(res, barcode, "Barcode added", 201);
};