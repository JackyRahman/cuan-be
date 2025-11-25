import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import { sendError } from "../utils/apiResponse";
import env from "../../config/env";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  if (env.nodeEnv !== "production") {
    console.error(err);
  }

  return sendError(res, "Internal Server Error", 500, "INTERNAL_ERROR");
}