import { Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../../common/utils/apiResponse";
import { createOutlet, getOutlets, getOutletById } from "./outlets.service";
import { ApiError } from "../../common/errors/ApiError";
import { AuthRequest } from "../../common/types/express";

const createOutletSchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional()
});

export const createOutletHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createOutletSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const outlet = await createOutlet({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, outlet, "Outlet created", 201);
};

export const listOutletsHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
  const outlets = await getOutlets(req.user.companyId);
  return sendSuccess(res, outlets);
};

export const getOutletHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");
  const { id } = req.params;
  const outlet = await getOutletById(req.user.companyId, id);
  return sendSuccess(res, outlet);
};
