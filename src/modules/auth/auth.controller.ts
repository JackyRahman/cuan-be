import { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { registerOwner, login } from "./auth.service";
import { ApiError } from "../../common/errors/ApiError";
import { loginSchema, registerSchema } from "./auth.dto";

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

  const result = await login(parseResult.data);
  return sendSuccess(res, result, "Login success");
};