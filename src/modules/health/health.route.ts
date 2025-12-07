import { Router } from "express";
import { healthCheck } from "./health.controller";
import { asyncHandler } from "../../common/utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(healthCheck));

export default router;