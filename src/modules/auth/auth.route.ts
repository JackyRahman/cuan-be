import { Router } from "express";
import { loginHandler, registerOwnerHandler } from "./auth.controller";

const router = Router();

router.post("/register-owner", registerOwnerHandler);
router.post("/login", loginHandler);

export default router;