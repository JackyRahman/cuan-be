import { Router } from "express";
import {
  adjustStockHandler,
  getInventoryByWarehouseHandler
} from "./inventory.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /inventory/warehouse/{warehouseId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     summary: Get inventory by warehouse
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Inventory list
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - variantId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                   productName: "Product A"
 *                   variantName: "Default"
 *                   sku: "SKU-001"
 *                   qty: 120
 *                   unitName: "pcs"
 */
router.get("/warehouse/:warehouseId", getInventoryByWarehouseHandler);

/**
 * @openapi
 * /inventory/adjust:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventory
 *     summary: Adjust stock for items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - warehouseId
 *               - lines
 *             properties:
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *               note:
 *                 type: string
 *               lines:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - variantId
 *                     - qtyDiff
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                     qtyDiff:
 *                       type: number
 *                       format: float
 *                     unitCost:
 *                       type: number
 *                       format: float
 *           example:
 *             warehouseId: "11111111-2222-3333-4444-555555555555"
 *             note: "Stock opname February"
 *             lines:
 *               - variantId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                 qtyDiff: -5
 *                 unitCost: 15000
 *               - variantId: "88888888-7777-6666-5555-444444444444"
 *                 qtyDiff: 10
 *                 unitCost: 12000
 *     responses:
 *       201:
 *         description: Stock adjusted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Stock adjusted"
 *               data:
 *                 adjustmentId: "aaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
 */
router.post("/adjust", requireRole("OWNER"), adjustStockHandler);

export default router;
