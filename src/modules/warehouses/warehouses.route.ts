import { Router } from "express";
import {
  createWarehouseHandler,
  getWarehouseHandler,
  listWarehousesHandler
} from "./warehouses.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /warehouses:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     summary: Create a warehouse
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - outletId
 *               - name
 *             properties:
 *               outletId:
 *                 type: string
 *                 format: uuid
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Warehouse created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     summary: List warehouses
 *     responses:
 *       200:
 *         description: List of warehouses
 */
router.post("/", requireRole("OWNER"), createWarehouseHandler);

/**
 * @openapi
 * /warehouses:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     summary: List warehouses
 *     responses:
 *       200:
 *         description: List of warehouses
 */
router.get("/", listWarehousesHandler);

/**
 * @openapi
 * /warehouses/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Warehouses
 *     summary: Get warehouse detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Warehouse detail
 */
router.get("/:id", getWarehouseHandler);

export default router;