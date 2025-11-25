import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code?: string;
    details?: any;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = "OK",
  statusCode = 200
) {
  const body: ApiResponse<T> = {
    success: true,
    message,
    data
  };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  message = "Internal Server Error",
  statusCode = 500,
  code?: string,
  details?: any
) {
  const body: ApiResponse = {
    success: false,
    message,
    error: { code, details }
  };
  return res.status(statusCode).json(body);
}