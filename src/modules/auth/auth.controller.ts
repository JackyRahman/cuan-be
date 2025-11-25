import { Request, Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../../common/utils/apiResponse";
import { registerOwner, login } from "./auth.service";
import { ApiError } from "../../common/errors/ApiError";

const registerSchema = z.object({
  companyId: z.string().uuid(),
  fullName: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email().optional(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  companyCode: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1)
});

export const registerOwnerHandler = async (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parseResult.error.format());
  }

  const payload = parseResult.data;

  const user = await registerOwner({
    companyId: payload.companyId,
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    password: payload.password
  });

  return sendSuccess(
    res,
    {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      company_id: user.company_id
    },
    "Owner created",
    201
  );
};

export const loginHandler = async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parseResult.error.format());
  }

  const { companyCode, username, password } = parseResult.data;
  const result = await login(companyCode, username, password);
  return sendSuccess(res, result, "Login success");
};