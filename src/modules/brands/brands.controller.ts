import { Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { AuthRequest } from "../../common/types/express";
import { createBrand, getBrandById, listBrands } from "./brands.service";

const createBrandSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional()
});

export const createBrandHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createBrandSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const brand = await createBrand({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, brand, "Brand created", 201);
};

export const listBrandsHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const brands = await listBrands(req.user.companyId);
  return sendSuccess(res, brands);
};

export const getBrandHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const { id } = req.params;
  const brand = await getBrandById(req.user.companyId, id);
  return sendSuccess(res, brand);
};