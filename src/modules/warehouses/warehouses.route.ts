import { Router } from "express";
import {
  createWarehouseHandler,
  getWarehouseHandler,
  listWarehousesHandler
} from "./warehouses.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.post("/", requireRole("OWNER"), createWarehouseHandler);
router.get("/", listWarehousesHandler);
router.get("/:id", getWarehouseHandler);

export default router;