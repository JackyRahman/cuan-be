import { Router } from "express";
import {
  createOutletHandler,
  listOutletsHandler,
  getOutletHandler
} from "./outlets.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";
import { asyncHandler } from "../../common/utils/asyncHandler";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /outlets:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Outlets
 *     summary: Create an outlet
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
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *           example:
 *             name: "Outlet Sudirman"
 *             code: "OUT-JKT"
 *             address: "Jl. Jend. Sudirman No. 10, Jakarta"
 *             phone: "+62-812-0000-0000"
 *     responses:
 *       201:
 *         description: Outlet created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Outlet created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Outlet Sudirman"
 *                 code: "OUT-JKT"
 *                 address: "Jl. Jend. Sudirman No. 10, Jakarta"
 *                 phone: "+62-812-0000-0000"
 */
router.post("/", requireRole("OWNER"), asyncHandler(createOutletHandler));

/**
 * @openapi
 * /outlets:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Outlets
   *     summary: List outlets
 *     responses:
 *       200:
 *         description: List of outlets
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "Outlet Sudirman"
 *                   code: "OUT-JKT"
 *                   address: "Jl. Jend. Sudirman No. 10, Jakarta"
 *                   phone: "+62-812-0000-0000"
 *                 - id: "22222222-3333-4444-5555-666666666666"
 *                   name: "Outlet Dago"
 *                   code: "OUT-BDG"
 *                   address: "Jl. Dago No. 1, Bandung"
 *                   phone: "+62-811-1111-1111"
 */
router.get("/", asyncHandler(listOutletsHandler));

/**
 * @openapi
 * /outlets/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Outlets
 *     summary: Get outlet detail
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
 *         description: Outlet detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Outlet Sudirman"
 *                 code: "OUT-JKT"
 *                 address: "Jl. Jend. Sudirman No. 10, Jakarta"
 *                 phone: "+62-812-0000-0000"
 */
router.get("/:id", asyncHandler(getOutletHandler));

export default router;