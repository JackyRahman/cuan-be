import { Router } from "express";
import {
  createOutletHandler,
  listOutletsHandler,
  getOutletHandler
} from "./outlets.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

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
 *     responses:
 *       201:
 *         description: Outlet created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Outlets
 *     summary: List outlets
 *     responses:
 *       200:
 *         description: List of outlets
 */
router.post("/", requireRole("OWNER"), createOutletHandler);

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
 */
router.get("/", listOutletsHandler);

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
 *     responses:
 *       200:
 *         description: Outlet detail
 */
router.get("/:id", getOutletHandler);

export default router;