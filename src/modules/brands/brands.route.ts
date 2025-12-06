import { Router } from "express";
import {
  createBrandHandler,
  getBrandHandler,
  listBrandsHandler
} from "./brands.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRole("OWNER"), createBrandHandler);
router.get("/", listBrandsHandler);
router.get("/:id", getBrandHandler);

export default router;
