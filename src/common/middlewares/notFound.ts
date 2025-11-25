import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/apiResponse";

export function notFoundHandler(req: Request, res: Response, _next: NextFunction) {
  return sendError(res, "Route not found", 404, "NOT_FOUND");
}