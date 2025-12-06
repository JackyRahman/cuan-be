import { Router } from "express";
import {
  createBrandHandler,
  getBrandHandler,
  listBrandsHandler
} from "./brands.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /brands:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brands
 *     summary: Create a brand
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
 *     responses:
 *       201:
 *         description: Brand created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brands
 *     summary: List brands
 *     responses:
 *       200:
 *         description: List of brands
 */
router.post("/", requireRole("OWNER"), createBrandHandler);

/**
 * @openapi
 * /brands:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brands
 *     summary: List brands
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get("/", listBrandsHandler);

/**
 * @openapi
 * /brands/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Brands
 *     summary: Get brand detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Brand detail
 */
router.get("/:id", getBrandHandler);

export default router;
