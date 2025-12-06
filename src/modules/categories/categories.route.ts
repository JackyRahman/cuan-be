import { Router } from "express";
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryHandler
} from "./categories.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRole("OWNER"), createCategoryHandler);
router.get("/", listCategoriesHandler);
router.get("/:id", getCategoryHandler);

export default router;