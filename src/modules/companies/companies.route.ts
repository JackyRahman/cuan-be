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
 *           example:
 *             name: "PT Cuan Abadi"
 *             code: "CUAN"
 *             taxId: "01.234.567.8-999.000"
 *             address: "Jl. Kebon Jeruk No. 1, Jakarta"
 *     responses:
 *       201:
 *         description: Company created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Company created"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "PT Cuan Abadi"
 *                 code: "CUAN"
 *                 taxId: "01.234.567.8-999.000"
 *                 address: "Jl. Kebon Jeruk No. 1, Jakarta"
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
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 - id: "11111111-2222-3333-4444-555555555555"
 *                   name: "PT Cuan Abadi"
 *                   code: "CUAN"
 *                   taxId: "01.234.567.8-999.000"
 *                   address: "Jl. Kebon Jeruk No. 1, Jakarta"
 *                 - id: "22222222-3333-4444-5555-666666666666"
 *                   name: "PT Untung Bersama"
 *                   code: "UNTG"
 *                   taxId: "02.345.678.9-888.000"
 *                   address: "Jl. Merdeka No. 2, Bandung"
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
 *           example: "11111111-2222-3333-4444-555555555555"
 *     responses:
 *       200:
 *         description: Company detail
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "OK"
 *               data:
 *                 id: "11111111-2222-3333-4444-555555555555"
 *                 name: "PT Cuan Abadi"
 *                 code: "CUAN"
 *                 taxId: "01.234.567.8-999.000"
 *                 address: "Jl. Kebon Jeruk No. 1, Jakarta"
 */
router.get("/:id", authMiddleware, requireRole("OWNER"), getCompanyHandler);

export default router;