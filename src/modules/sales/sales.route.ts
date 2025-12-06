import { Router } from "express";
import { authMiddleware, requireAnyRole } from "../../common/middlewares/auth";
import {
  createSaleHandler,
  getSaleDetailHandler,
  listSalesHandler
} from "./sales.controller";

const router = Router();

router.use(authMiddleware);

/**
 * @openapi
 * /sales:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sales
 *     summary: Create a sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - outletId
 *               - warehouseId
 *               - items
 *               - payments
 *             properties:
 *               outletId:
 *                 type: string
 *                 format: uuid
 *               shiftId:
 *                 type: string
 *                 format: uuid
 *               warehouseId:
 *                 type: string
 *                 format: uuid
 *               customerId:
 *                 type: string
 *                 format: uuid
 *               note:
 *                 type: string
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - variantId
 *                     - qty
 *                   properties:
 *                     variantId:
 *                       type: string
 *                       format: uuid
 *                     qty:
 *                       type: number
 *                     unitPrice:
 *                       type: number
 *                     discountAmount:
 *                       type: number
 *               payments:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - paymentMethodId
 *                     - amount
 *                   properties:
 *                     paymentMethodId:
 *                       type: string
 *                       format: uuid
 *                     amount:
 *                       type: number
 *                     reference:
 *                       type: string
 *     responses:
 *       201:
 *         description: Sale created
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
 *                     saleId:
 *                       type: string
 *                     invoiceNumber:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                     stockMovementId:
 *                       type: string
 *             example:
 *               success: true
 *               message: Sale created
 *               data:
 *                 saleId: "11111111-2222-3333-4444-555555555555"
 *                 invoiceNumber: "OUT/20250201/1234"
 *                 totalAmount: 150000
 *                 stockMovementId: "99999999-aaaa-bbbb-cccc-dddddddddddd"
 */
router.post("/", requireAnyRole(["OWNER", "KASIR"]), createSaleHandler);

/**
 * @openapi
 * /sales:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sales
 *     summary: List sales
 *     parameters:
 *       - in: query
 *         name: outletId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           example: "2025-01-01"
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           example: "2025-02-01"
 *     responses:
 *       200:
 *         description: List of sales
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       invoiceNumber:
 *                         type: string
 *                       saleDateTime:
 *                         type: string
 *                       outletName:
 *                         type: string
 *                       customerName:
 *                         type: string
 *                         nullable: true
 *                       totalAmount:
 *                         type: number
 *             example:
 *               success: true
 *               data:
 *                 - id: "sale-1"
 *                   invoiceNumber: "OUT/20250201/1234"
 *                   saleDateTime: "2025-02-01T10:00:00.000Z"
 *                   outletName: "Outlet A"
 *                   customerName: "Budi"
 *                   totalAmount: 200000
 */
router.get("/", requireAnyRole(["OWNER", "KASIR"]), listSalesHandler);

/**
 * @openapi
 * /sales/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sales
 *     summary: Get sale detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sale detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     invoiceNumber:
 *                       type: string
 *                     saleDateTime:
 *                       type: string
 *                     outletId:
 *                       type: string
 *                     outletName:
 *                       type: string
 *                     customerId:
 *                       type: string
 *                       nullable: true
 *                     customerName:
 *                       type: string
 *                       nullable: true
 *                     subtotal:
 *                       type: number
 *                     discountAmount:
 *                       type: number
 *                     taxAmount:
 *                       type: number
 *                     totalAmount:
 *                       type: number
 *                     note:
 *                       type: string
 *                       nullable: true
 *                     lines:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           variantId:
 *                             type: string
 *                           qty:
 *                             type: number
 *                           unitPrice:
 *                             type: number
 *                           discountAmount:
 *                             type: number
 *                           lineTotal:
 *                             type: number
 *                           productName:
 *                             type: string
 *                           productCode:
 *                             type: string
 *                             nullable: true
 *                           variantName:
 *                             type: string
 *                             nullable: true
 *                           sku:
 *                             type: string
 *                             nullable: true
 *                     payments:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           paymentMethodId:
 *                             type: string
 *                           amount:
 *                             type: number
 *                           reference:
 *                             type: string
 *                             nullable: true
 *                           paymentMethodName:
 *                             type: string
 *                           paymentMethodCode:
 *                             type: string
 *                             nullable: true
 *             example:
 *               success: true
 *               data:
 *                 id: "sale-1"
 *                 invoiceNumber: "OUT/20250201/1234"
 *                 saleDateTime: "2025-02-01T10:00:00.000Z"
 *                 outletId: "outlet-1"
 *                 outletName: "Outlet A"
 *                 customerId: "cust-1"
 *                 customerName: "Budi"
 *                 subtotal: 200000
 *                 discountAmount: 10000
 *                 taxAmount: 0
 *                 totalAmount: 190000
 *                 note: "Thank you"
 *                 lines:
 *                   - id: "line-1"
 *                     variantId: "variant-1"
 *                     qty: 2
 *                     unitPrice: 100000
 *                     discountAmount: 0
 *                     lineTotal: 200000
 *                     productName: "Product A"
 *                     productCode: "PA-01"
 *                     variantName: "Default"
 *                     sku: "SKU-123"
 *                 payments:
 *                   - id: "pay-1"
 *                     paymentMethodId: "pm-1"
 *                     amount: 190000
 *                     reference: "CASH"
 *                     paymentMethodName: "Cash"
 *                     paymentMethodCode: "CASH"
 */
router.get("/:id", requireAnyRole(["OWNER", "KASIR"]), getSaleDetailHandler);

export default router;