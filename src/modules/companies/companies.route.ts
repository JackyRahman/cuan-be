import { Router } from "express";
import {
  createCompanyHandler,
  listCompaniesHandler,
  getCompanyHandler
} from "./companies.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.post("/", createCompanyHandler);
router.get("/", authMiddleware, requireRole("OWNER"), listCompaniesHandler);
router.get("/:id", authMiddleware, requireRole("OWNER"), getCompanyHandler);

export default router;