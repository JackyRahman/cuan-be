import { Router } from "express";
import {
  adjustStockHandler,
  getInventoryByWarehouseHandler
} from "./inventory.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.get("/warehouse/:warehouseId", getInventoryByWarehouseHandler);
router.post("/adjust", requireRole("OWNER"), adjustStockHandler);

export default router;
