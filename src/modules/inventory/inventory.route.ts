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
 *     responses:
 *       200:
 *         description: Inventory list
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
 *     responses:
 *       201:
 *         description: Stock adjusted
 */
router.post("/adjust", requireRole("OWNER"), adjustStockHandler);

export default router;
