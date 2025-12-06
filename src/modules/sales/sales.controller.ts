import { Response } from "express";
import { AuthRequest } from "../../common/types/express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { createSaleSchema, listSalesQuerySchema } from "./sales.dto";
import { createSale, getSaleDetail, listSales } from "./sales.service";

export const createSaleHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createSaleSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const result = await createSale({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, result, "Sale created", 201);
};

export const getSaleDetailHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
  const { id } = req.params;

  const data = await getSaleDetail(req.user.companyId, id);
  return sendSuccess(res, data);
};

export const listSalesHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = listSalesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const sales = await listSales(req.user.companyId, parsed.data);
  return sendSuccess(res, sales);
};