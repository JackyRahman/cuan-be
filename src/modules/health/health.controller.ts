import { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/apiResponse";

export const healthCheck = async (_req: Request, res: Response) => {

  /**
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - Health
   *     summary: Health check
   *     responses:
   *       200:
   *         description: Service status
   *         content:
   *           application/json:
   *             example:
   *               success: true
   *               message: "Service healthy"
   *               data:
   *                 status: "OK"
   */
  return sendSuccess(res, { status: "OK" }, "Service healthy");
};