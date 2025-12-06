import { Router } from "express";
import {
  addBarcodeHandler,
  createProductHandler,
  createVariantHandler,
  listProductsHandler
} from "./products.controller";
import { authMiddleware, requireRole } from "../../common/middlewares/auth";

const router = Router();

router.use(authMiddleware);
router.get("/", listProductsHandler);
router.post("/", requireRole("OWNER"), createProductHandler);
router.post("/variants", requireRole("OWNER"), createVariantHandler);
router.post("/barcodes", requireRole("OWNER"), addBarcodeHandler);

export default router;