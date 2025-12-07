import { Router } from "express";
import {
  addBarcodeHandler,
  createProductHandler,
  createProductWithRelationsHandler,
  createVariantHandler,
  listProductsHandler
} from "./products.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";
import { asyncHandler } from "../../common/utils/asyncHandler";

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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "Product A"
 *                   code: "PRD-A"
 *                   brandName: "Nike"
 *                   categoryName: "Shoes"
 *                   isService: false
 */
router.get("/", asyncHandler(listProductsHandler));

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
 *           example:
 *             categoryId: "33333333-4444-5555-6666-777777777777"
 *             brandId: "22222222-3333-4444-5555-666666666666"
 *             name: "Product A"
 *             code: "PRD-A"
 *             description: "Comfortable running shoes"
 *             isService: false
 *     responses:
 *       201:
 *         description: Product created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Product created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Product A"
 *                 code: "PRD-A"
 *                 isService: false
 */
router.post("/", requireRole("OWNER"), asyncHandler(createProductHandler));

/**
 * @openapi
 * /products/full:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     summary: Create a product with variants and barcodes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - variants
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
 *               variants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     sku:
 *                       type: string
 *                     unitId:
 *                       type: string
 *                       format: uuid
 *                     costPrice:
 *                       type: number
 *                       format: float
 *                     sellPrice:
 *                       type: number
 *                       format: float
 *                     barcodes:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           barcode:
 *                             type: string
 *                           isPrimary:
 *                             type: boolean
 *           example:
 *             name: "Product A"
 *             code: "PRD-A"
 *             variants:
 *               - name: "Size 42"
 *                 sku: "PRD-A-42"
 *                 costPrice: 250000
 *                 unitId: "66666666-7777-8888-9999-aaaaaaaaaaaa"
 *                 sellPrice: 350000
 *                 barcodes:
 *                   - barcode: "8991234567890"
 *                     isPrimary: true
 *                   - barcode: "8991234567891"
 *               - name: "Size 43"
 *                 unitId: "55555555-6666-7777-8888-999999999999"
 *                 sku: "PRD-A-43"
 *                 barcodes:
 *                   - barcode: "8991234567892"
 *     responses:
 *       201:
 *         description: Product created with variants and barcodes
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Product with variants created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Product A"
 *                 variants:
 *                   - id: "variant-id-1"
 *                     name: "Size 42"
 *                     barcodes:
 *                       - id: "barcode-id-1"
 *                         barcode: "8991234567890"
 *                         is_primary: true
 */
router.post("/full", requireRole("OWNER"), asyncHandler(createProductWithRelationsHandler));

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
 *           example:
 *             productId: "11111111-2222-3333-4444-555555555555"
 *             name: "Size 42"
 *             sku: "PRD-A-42"
 *             unitId: "66666666-7777-8888-9999-aaaaaaaaaaaa"
 *             costPrice: 250000
 *             sellPrice: 350000
 *     responses:
 *       201:
 *         description: Variant created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Variant created"
 *               data:
 *                 id: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                 productId: "11111111-2222-3333-4444-555555555555"
 *                 name: "Size 42"
 *                 sku: "PRD-A-42"
 */
router.post("/variants", requireRole("OWNER"), asyncHandler(createVariantHandler));

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
 *           example:
 *             variantId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *             barcode: "8991234567890"
 *             isPrimary: true
 *     responses:
 *       201:
 *         description: Barcode added
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Barcode added"
 *               data:
 *                 id: "bbbbbbbb-cccc-dddd-eeee-ffffffffffff"
 *                 variantId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                 barcode: "8991234567890"
 *                 isPrimary: true
 */
router.post("/barcodes", requireRole("OWNER"), asyncHandler(addBarcodeHandler));

export default router;