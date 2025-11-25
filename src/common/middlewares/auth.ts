import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import { sendError } from "../utils/apiResponse";
import { AuthRequest, AuthUser } from "../types/express";

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
  }

  const token = authHeader.substring("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwt.secret) as AuthUser;
    req.user = payload;
    return next();
  } catch (_err) {
    return sendError(res, "Invalid or expired token", 401, "UNAUTHORIZED");
  }
}

export function requireRole(role: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, "Unauthorized", 401, "UNAUTHORIZED");
    }
    if (!req.user.roles.includes(role)) {
      return sendError(res, "Forbidden", 403, "FORBIDDEN");
    }
    next();
  };
}