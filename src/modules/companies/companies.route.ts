import { Router } from "express";
import {
  createCompanyHandler,
  listCompaniesHandler,
  getCompanyHandler
} from "./companies.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

/**
 * @openapi
 * /companies:
 *   post:
 *     tags:
 *       - Companies
 *     summary: Create a company
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
 *               taxId:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Companies
 *     summary: List companies
 *     responses:
 *       200:
 *         description: List of companies
 */
router.post("/", createCompanyHandler);

/**
 * @openapi
 * /companies:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Companies
 *     summary: List companies
 *     responses:
 *       200:
 *         description: List of companies
 */
router.get("/", authMiddleware, requireRole("OWNER"), listCompaniesHandler);

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Companies
 *     summary: Get company detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Company detail
 */
router.get("/:id", authMiddleware, requireRole("OWNER"), getCompanyHandler);

export default router;