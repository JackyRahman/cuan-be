import { RequestHandler } from "express";

type AsyncRouteHandler = (...args: Parameters<RequestHandler>) => Promise<unknown>;

export function asyncHandler(fn: AsyncRouteHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}