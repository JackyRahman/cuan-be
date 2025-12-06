import { Router } from "express";
import { loginHandler, registerOwnerHandler } from "./auth.controller";

const router = Router();

router.post("/register-owner", registerOwnerHandler);

/**
 * @openapi
 * /auth/register-owner:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register owner for a company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - fullName
 *               - username
 *               - password
 *             properties:
 *               companyId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Owner created successfully
 *       400:
 *         description: Validation error
 */
/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyCode
 *               - username
 *               - password
 *             properties:
 *               companyCode:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login success
 */
router.post("/login", loginHandler);

export default router;