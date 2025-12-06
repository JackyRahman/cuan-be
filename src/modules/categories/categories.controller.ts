import { Response } from "express";
import { z } from "zod";
import { sendSuccess } from "../../common/utils/apiResponse";
import { ApiError } from "../../common/errors/ApiError";
import { AuthRequest } from "../../common/types/express";
import {
  createCategory,
  listCategories,
  getCategoryById
} from "./categories.service";

const createCategorySchema = z.object({
  name: z.string().min(1),
  code: z.string().optional(),
  parentId: z.string().uuid().optional()
});

export const createCategoryHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const parsed = createCategorySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(400, "Validation error", "VALIDATION_ERROR", parsed.error.format());
  }

  const category = await createCategory({
    companyId: req.user.companyId,
    ...parsed.data
  });

  return sendSuccess(res, category, "Category created", 201);
};

export const listCategoriesHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const categories = await listCategories(req.user.companyId);
  return sendSuccess(res, categories);
};

export const getCategoryHandler = async (req: AuthRequest, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized", "UNAUTHORIZED");

  const { id } = req.params;
  const category = await getCategoryById(req.user.companyId, id);
  return sendSuccess(res, category);
};