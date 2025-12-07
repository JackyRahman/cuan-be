import { Router } from "express";
import {
  createWarehouseHandler,
  getWarehouseHandler,
  listWarehousesHandler
} from "./warehouses.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";
import { asyncHandler } from "../../common/utils/asyncHandler";

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
 *           example:
 *             outletId: "22222222-3333-4444-5555-666666666666"
 *             name: "Warehouse Jakarta"
 *             code: "WH-JKT"
 *             type: "MAIN"
 *     responses:
 *       201:
 *         description: Warehouse created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Warehouse created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 outletId: "22222222-3333-4444-5555-666666666666"
 *                 name: "Warehouse Jakarta"
 *                 code: "WH-JKT"
 *                 type: "MAIN"
 */
router.post("/", requireRole("OWNER"), asyncHandler(createWarehouseHandler));

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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   outletId: "22222222-3333-4444-5555-666666666666"
 *                   name: "Warehouse Jakarta"
 *                   code: "WH-JKT"
 *                   type: "MAIN"
 *                 - id: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                   outletId: "33333333-4444-5555-6666-777777777777"
 *                   name: "Warehouse Bandung"
 *                   code: "WH-BDG"
 *                   type: "BRANCH"
 */
router.get("/", asyncHandler(listWarehousesHandler));

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
 *           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Warehouse detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 outletId: "22222222-3333-4444-5555-666666666666"
 *                 name: "Warehouse Jakarta"
 *                 code: "WH-JKT"
 *                 type: "MAIN"
 */
router.get("/:id", asyncHandler(getWarehouseHandler));

export default router;