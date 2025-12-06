import { Request, Response } from "express";
import { sendSuccess } from "../../common/utils/apiResponse";
import { createCompany, getCompanies, getCompanyById } from "./companies.service";
import { ApiError } from "../../common/errors/ApiError";
import { createCompanySchema } from "./companies.dto";

export const createCompanyHandler = async (req: Request, res: Response) => {
  const parsed = createCompanySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const company = await createCompany(parsed.data);
  return sendSuccess(res, company, "Company created", 201);
};

export const listCompaniesHandler = async (_req: Request, res: Response) => {
  const companies = await getCompanies();
  return sendSuccess(res, companies);
};

export const getCompanyHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  const company = await getCompanyById(id);
  return sendSuccess(res, company);
};