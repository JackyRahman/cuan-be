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
 *           example:
 *             companyId: "11111111-2222-3333-4444-555555555555"
 *             fullName: "Budi Santoso"
 *             username: "budi"
 *             email: "budi@example.com"
 *             password: "superSecret123"
 *     responses:
 *       201:
 *         description: Owner created successfully
 *          content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     companyId:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Owner registered"
 *               data:
 *                 userId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 *                 companyId: "11111111-2222-3333-4444-555555555555"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Username already taken"
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
 *           example:
 *             companyCode: "CUAN"
 *             username: "budi"
 *             password: "superSecret123"
 *     responses:
 *       200:
 *         description: Login success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *             example:
 *               success: true
 *               message: "Login success"
 *               data:
 *                 accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken: "def50200f1b2c3d4..."
 */
router.post("/login", loginHandler);

export default router;