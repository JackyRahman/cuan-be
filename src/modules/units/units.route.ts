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
 *           example:
 *             name: "Pieces"
 *             shortName: "pcs"
 *             code: "PCS"
 *     responses:
 *       201:
 *         description: Unit created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Unit created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Pieces"
 *                 shortName: "pcs"
 *                 code: "PCS"
 */
router.post("/", requireRole("OWNER"), createUnitHandler);

/**
 * @openapi
   *   get:
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Units
   *     summary: List units
 *     responses:
 *       200:
 *         description: List of units
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "Pieces"
 *                   shortName: "pcs"
 *                   code: "PCS"
 *                 - id: "22222222-3333-4444-5555-666666666666"
 *                   name: "Kilogram"
 *                   shortName: "kg"
 *                   code: "KG"
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
*           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Unit detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "Pieces"
 *                 shortName: "pcs"
 *                 code: "PCS"
 */
router.get("/:id", getUnitHandler);

export default router;