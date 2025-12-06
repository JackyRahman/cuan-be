import { Router } from "express";
import {
  createUnitHandler,
  getUnitHandler,
  listUnitsHandler
} from "./units.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRole("OWNER"), createUnitHandler);
router.get("/", listUnitsHandler);
router.get("/:id", getUnitHandler);

export default router;