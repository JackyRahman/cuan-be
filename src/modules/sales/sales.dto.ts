import { z } from "zod";

/**
 * REQUEST DTO SCHEMAS
 */

export const saleItemSchema = z.object({
  variantId: z.string().uuid(),
  qty: z.number().positive(),
  unitPrice: z.number().nonnegative().optional(),
  discountAmount: z.number().nonnegative().optional()
});

export const salePaymentSchema = z.object({
  paymentMethodId: z.string().uuid(),
  amount: z.number().positive(),
  reference: z.string().optional()
});

export const createSaleSchema = z.object({
  outletId: z.string().uuid(),
  shiftId: z.string().uuid().optional(),
  warehouseId: z.string().uuid(),
  customerId: z.string().uuid().optional(),
  note: z.string().optional(),
  items: z.array(saleItemSchema).min(1),
  payments: z.array(salePaymentSchema).min(1)
});

export const listSalesQuerySchema = z.object({
  outletId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional()
});

/**
 * REQUEST DTO TYPES
 */

export type SaleItemDto = z.infer<typeof saleItemSchema>;
export type SalePaymentDto = z.infer<typeof salePaymentSchema>;
export type CreateSaleDto = z.infer<typeof createSaleSchema>;
export type ListSalesQueryDto = z.infer<typeof listSalesQuerySchema>;

/**
 * RESPONSE DTO
 */

export interface SaleCreatedDto {
  saleId: string;
  invoiceNumber: string;
  totalAmount: number;
  stockMovementId: string;
}

export interface SaleListItemDto {
  id: string;
  invoiceNumber: string;
  saleDateTime: string;
  outletName: string;
  customerName: string | null;
  totalAmount: number;
}

export interface SaleDetailLineDto {
  id: string;
  variantId: string;
  qty: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
  productName: string;
  productCode: string | null;
  variantName: string | null;
  sku: string | null;
}

export interface SaleDetailPaymentDto {
  id: string;
  paymentMethodId: string;
  amount: number;
  reference: string | null;
  paymentMethodName: string;
  paymentMethodCode: string | null;
}

export interface SaleDetailDto {
  id: string;
  invoiceNumber: string;
  saleDateTime: string;
  outletId: string;
  outletName: string;
  customerId: string | null;
  customerName: string | null;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  note: string | null;
  lines: SaleDetailLineDto[];
  payments: SaleDetailPaymentDto[];
}

export interface SaleListRow {
  id: string;
  invoice_number: string;
  sale_datetime: string;
  outlet_name: string;
  customer_name: string | null;
  total_amount: string | number;
}

export interface SaleDetailRow {
  id: string;
  invoice_number: string;
  sale_datetime: string;
  outlet_id: string;
  outlet_name: string;
  customer_id: string | null;
  customer_name: string | null;
  subtotal: string | number;
  discount_amount: string | number;
  tax_amount: string | number;
  total_amount: string | number;
  note: string | null;
}

export interface SaleLineRow {
  id: string;
  variant_id: string;
  qty: string | number;
  unit_price: string | number;
  discount_amount: string | number;
  line_total: string | number;
  product_name: string;
  product_code: string | null;
  variant_name: string | null;
  sku: string | null;
}

export interface SalePaymentRow {
  id: string;
  payment_method_id: string;
  amount: string | number;
  reference: string | null;
  payment_method_name: string;
  payment_method_code: string | null;
}

/**
 * MAPPERS (DB row -> DTO)
 */

export function mapSaleListRow(row: SaleListRow): SaleListItemDto {
  return {
    id: row.id,
    invoiceNumber: row.invoice_number,
    saleDateTime: row.sale_datetime,
    outletName: row.outlet_name,
    customerName: row.customer_name ?? null,
    totalAmount: Number(row.total_amount)
  };
}

export function mapSaleDetail(
  saleRow: SaleDetailRow,
  lineRows: SaleLineRow[],
  paymentRows: SalePaymentRow[]
): SaleDetailDto {
  return {
    id: saleRow.id,
    invoiceNumber: saleRow.invoice_number,
    saleDateTime: saleRow.sale_datetime,
    outletId: saleRow.outlet_id,
    outletName: saleRow.outlet_name,
    customerId: saleRow.customer_id,
    customerName: saleRow.customer_name ?? null,
    subtotal: Number(saleRow.subtotal),
    discountAmount: Number(saleRow.discount_amount),
    taxAmount: Number(saleRow.tax_amount),
    totalAmount: Number(saleRow.total_amount),
    note: saleRow.note,
    lines: lineRows.map((l) => ({
      id: l.id,
      variantId: l.variant_id,
      qty: Number(l.qty),
      unitPrice: Number(l.unit_price),
      discountAmount: Number(l.discount_amount),
      lineTotal: Number(l.line_total),
      productName: l.product_name,
      productCode: l.product_code,
      variantName: l.variant_name,
      sku: l.sku
    })),
    payments: paymentRows.map((p) => ({
      id: p.id,
      paymentMethodId: p.payment_method_id,
      amount: Number(p.amount),
      reference: p.reference,
      paymentMethodName: p.payment_method_name,
      paymentMethodCode: p.payment_method_code
    }))
  };
}