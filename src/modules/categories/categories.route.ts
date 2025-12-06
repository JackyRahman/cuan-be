import { Router } from "express";
import {
  createCategoryHandler,
  listCategoriesHandler,
  getCategoryHandler
} from "./categories.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /categories:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Create a category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Category created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: List categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.post("/", requireRole("OWNER"), createCategoryHandler);

/**
 * @openapi
 * /categories:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: List categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get("/", listCategoriesHandler);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categories
 *     summary: Get category detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category detail
 */
router.get("/:id", getCategoryHandler);

export default router;