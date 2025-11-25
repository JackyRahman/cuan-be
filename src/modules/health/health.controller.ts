import { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/apiResponse";

export const healthCheck = async (_req: Request, res: Response) => {
  return sendSuccess(res, { status: "OK" }, "Service healthy");
};