import { Router } from "express";
import {
  addBarcodeHandler,
  createProductHandler,
  createVariantHandler,
  listProductsHandler
} from "./products.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /products:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: List products
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               brandId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               isService:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 */
router.get("/", listProductsHandler);

/**
 * @openapi
 * /products:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: Create a product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *               brandId:
 *                 type: string | null
 *                 format: uuid
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               isService:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created
 */
router.post("/", requireRole("OWNER"), createProductHandler);

/**
 * @openapi
 * /products/variants:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: Create product variant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               sku:
 *                 type: string
 *               unitId:
 *                 type: string
 *                 format: uuid
 *               costPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *               sellPrice:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *     responses:
 *       201:
 *         description: Variant created
 */
router.post("/variants", requireRole("OWNER"), createVariantHandler);

/**
 * @openapi
 * /products/barcodes:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: Add barcode to variant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - variantId
 *               - barcode
 *             properties:
 *               variantId:
 *                 type: string
 *                 format: uuid
 *               barcode:
 *                 type: string
 *               isPrimary:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Barcode added
 */
router.post("/barcodes", requireRole("OWNER"), addBarcodeHandler);

export default router;