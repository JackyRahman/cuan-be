import { Router } from "express";
import {
  createOutletHandler,
  listOutletsHandler,
  getOutletHandler
} from "./outlets.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRole("OWNER"), createOutletHandler);
router.get("/", listOutletsHandler);
router.get("/:id", getOutletHandler);

export default router;