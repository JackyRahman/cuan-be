import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { DatabaseError } from "pg";
import { ZodError } from "zod";
import env from "../../config/env";
import { ApiError } from "../errors/ApiError";
import { sendError } from "../utils/apiResponse";

const PG_ERROR_MAPPINGS: Record<
  string,
  { status: number; code: string; message: string }
> = {
  23505: { status: 409, code: "CONFLICT", message: "Duplicate value" },
  23503: { status: 409, code: "CONFLICT", message: "Referenced record not found" },
  23502: { status: 400, code: "INVALID_INPUT", message: "Missing required field" },
  "22P02": { status: 400, code: "INVALID_INPUT", message: "Invalid input syntax" }
};

const SYSTEM_ERROR_CODES: Record<string, { status: number; code: string; message: string }> = {
  ECONNRESET: { status: 503, code: "CONNECTION_RESET", message: "Connection was reset" },
  ECONNREFUSED: { status: 503, code: "CONNECTION_REFUSED", message: "Database connection refused" },
  ETIMEDOUT: { status: 504, code: "TIMEOUT", message: "Operation timed out" }
};

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  if (err instanceof ZodError) {
    return sendError(res, "Validation error", 400, "VALIDATION_ERROR", err.format());
  }

  if (err instanceof TokenExpiredError) {
    return sendError(res, "Token expired", 401, "TOKEN_EXPIRED");
  }

  if (err instanceof JsonWebTokenError) {
    return sendError(res, "Invalid token", 401, "INVALID_TOKEN");
  }

  if (err instanceof SyntaxError && "body" in err) {
    return sendError(res, "Malformed JSON payload", 400, "INVALID_JSON");
  }

  if (err instanceof DatabaseError) {
    const code = err.code as string | undefined;
    const mapping = code ? PG_ERROR_MAPPINGS[code] : undefined;
    if (mapping) {
      return sendError(res, err.detail || mapping.message, mapping.status, mapping.code);
    }
  }

  if (typeof err?.code === "string") {
    const mapping = SYSTEM_ERROR_CODES[err.code];
    if (mapping) {
      return sendError(res, err.message || mapping.message, mapping.status, mapping.code);
    }
  }

  if (env.nodeEnv !== "production") {
    console.error(err);
  }

  return sendError(res, "Internal Server Error", 500, "INTERNAL_ERROR");
}