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
 *           example:
 *             name: "Electronics"
 *             code: "ELEC"
 *             parentId: null
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Category created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Electronics"
 *                 code: "ELEC"
 *                 parentId: null
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Categories
   *     summary: List categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "Electronics"
 *                   code: "ELEC"
 *                   parentId: null
 *                 - id: "22222222-3333-4444-5555-666666666666"
 *                   name: "Smartphone"
 *                   code: "PHONE"
 *                   parentId: "11111111-2222-3333-4444-555555555555"
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
*           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Category detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Electronics"
 *                 code: "ELEC"
 *                 parentId: null
 */
router.get("/:id", getCategoryHandler);

export default router;