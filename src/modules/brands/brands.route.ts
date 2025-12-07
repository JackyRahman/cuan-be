import { Router } from "express";
import {
  createBrandHandler,
  getBrandHandler,
  listBrandsHandler
} from "./brands.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";
import { asyncHandler } from "../../common/utils/asyncHandler";

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
 *           example:
 *             name: "Nike"
 *             code: "NIKE"
 *     responses:
 *       201:
 *         description: Brand created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     code:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Brand created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Nike"
 *                 code: "NIKE"
 */
router.post("/", requireRole("OWNER"), asyncHandler(createBrandHandler));

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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "Nike"
 *                   code: "NIKE"
 *                 - id: "22222222-3333-4444-5555-666666666666"
 *                   name: "Adidas"
 *                   code: "ADIDAS"
 */
router.get("/", asyncHandler(listBrandsHandler));

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
 *           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Brand detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Nike"
 *                 code: "NIKE"
 */
router.get("/:id", asyncHandler(getBrandHandler));

export default router;
