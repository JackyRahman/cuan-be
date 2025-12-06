import { Response } from "express";
import { AuthRequest } from "../../common/types/express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import {
  createWarehouse,
  getWarehouseByIdForCompany,
  listWarehousesByCompany
} from "./warehouses.service";
import { createWarehouseSchema } from "./warehouses.dto";

export const createWarehouseHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createWarehouseSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const wh = await createWarehouse(parsed.data);
  return sendSuccess(res, wh, "Warehouse created", 201);
};

export const listWarehousesHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const data = await listWarehousesByCompany(req.user.companyId);
  return sendSuccess(res, data);
};

export const getWarehouseHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const { id } = req.params;
  const wh = await getWarehouseByIdForCompany(req.user.companyId, id);
  return sendSuccess(res, wh);
};