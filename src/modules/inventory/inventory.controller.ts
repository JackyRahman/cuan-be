import { Response } from "express";
import { AuthRequest } from "../../common/types/express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { adjustStock, getInventoryByWarehouseForCompany } from "./inventory.service";
import { adjustStockSchema, getInventorySchema } from "./inventory.dto";

export const getInventoryByWarehouseHandler = async (
  req: AuthRequest,
  res: Response
) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsedQuery = getInventorySchema.safeParse({
    warehouseId: req.params.warehouseId
  });
  if (!parsedQuery.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsedQuery.error.format());
  }

  const data = await getInventoryByWarehouseForCompany(
    req.user.companyId,
    parsedQuery.data.warehouseId
  );
  return sendSuccess(res, data);
};

export const adjustStockHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = adjustStockSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const result = await adjustStock(req.user.companyId, parsed.data);
  return sendSuccess(res, result, "Stock adjusted", 201);
};