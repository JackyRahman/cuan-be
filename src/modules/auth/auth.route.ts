import { Router } from "express";
import { loginHandler, registerOwnerHandler } from "./auth.controller";

const router = Router();

router.post("/register-owner", registerOwnerHandler);

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