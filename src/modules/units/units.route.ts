import { Router } from "express";
import {
  createUnitHandler,
  getUnitHandler,
  listUnitsHandler
} from "./units.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /units:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Units
 *     summary: Create a unit
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
 *               shortName:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unit created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Units
 *     summary: List units
 *     responses:
 *       200:
 *         description: List of units
 */
router.post("/", requireRole("OWNER"), createUnitHandler);

/**
 * @openapi
 * /units:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Units
 *     summary: List units
 *     responses:
 *       200:
 *         description: List of units
 */
router.get("/", listUnitsHandler);

/**
 * @openapi
 * /units/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Units
 *     summary: Get unit detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Unit detail
 */
router.get("/:id", getUnitHandler);

export default router;