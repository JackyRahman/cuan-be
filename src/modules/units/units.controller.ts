import { Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { AuthRequest } from "../../common/types/express";
import { createUnit, getUnitById, listUnits } from "./units.service";

const createUnitSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().optional(),
  code: z.string().optional()
});

export const createUnitHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createUnitSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const unit = await createUnit({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, unit, "Unit created", 201);
};

export const listUnitsHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const units = await listUnits(req.user.companyId);
  return sendSuccess(res, units);
};

export const getUnitHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const { id } = req.params;
  const unit = await getUnitById(req.user.companyId, id);
  return sendSuccess(res, unit);
};