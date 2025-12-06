import { PoolClient } from "pg";
import { query, withTransaction } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";
import {
  CreateSaleDto,
  ListSalesQueryDto,
  SaleCreatedDto,
  SaleDetailDto,
  SaleDetailRow,
  SaleLineRow,
  SaleListItemDto,
  SaleListRow,
  SalePaymentRow,
  mapSaleDetail,
  mapSaleListRow
} from "./sales.dto";

interface VariantPriceRow {
  id: string;
  sell_price: string;
  cost_price: string;
}

interface OutletRow {
  id: string;
  code: string | null;
}

function generateInvoiceNumber(outletCode: string | null): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `${outletCode || "OUT"}/${datePart}/${rand}`;
}

export async function createSale(
  input: CreateSaleDto & { companyId: string }
): Promise<SaleCreatedDto> {
  if (!input.items || input.items.length === 0) {
    throw new ApiError(400, "Items cannot be empty", "EMPTY_ITEMS");
  }
  if (!input.payments || input.payments.length === 0) {
    throw new ApiError(400, "Payments cannot be empty", "EMPTY_PAYMENTS");
  }

  return withTransaction<SaleCreatedDto>(async (client: PoolClient) => {
    const outletRes = await client.query<OutletRow>(
      `
      SELECT o.id, o.code
        FROM outlets o
       WHERE o.id = $1
         AND o.company_id = $2
         AND o.deleted_at IS NULL
      `,
      [input.outletId, input.companyId]
    );
    const outlet = outletRes.rows[0];
    if (!outlet) {
      throw new ApiError(404, "Outlet not found", "OUTLET_NOT_FOUND");
    }

    const whRes = await client.query(
      `
      SELECT w.id
        FROM warehouses w
        JOIN outlets o ON o.id = w.outlet_id
       WHERE w.id = $1
         AND o.company_id = $2
         AND w.deleted_at IS NULL
      `,
      [input.warehouseId, input.companyId]
    );
    if (!whRes.rows[0]) {
      throw new ApiError(404, "Warehouse not found", "WAREHOUSE_NOT_FOUND");
    }

    const variantIds = Array.from(new Set(input.items.map((i) => i.variantId)));
    const variantsRes = await client.query<VariantPriceRow>(
      `
      SELECT id, sell_price, cost_price
        FROM product_variants
       WHERE id = ANY($1::uuid[])
         AND deleted_at IS NULL
      `,
      [variantIds]
    );

    const variantsMap = new Map<string, { sell_price: string; cost_price: string }>();
    for (const v of variantsRes.rows) {
      variantsMap.set(v.id, {
        sell_price: v.sell_price,
        cost_price: v.cost_price
      });
    }

    for (const line of input.items) {
      if (!variantsMap.has(line.variantId)) {
        throw new ApiError(400, "Variant not found", "VARIANT_NOT_FOUND", {
          variantId: line.variantId
        });
      }
      if (line.qty <= 0) {
        throw new ApiError(400, "Qty must be > 0", "INVALID_QTY");
      }
    }

    let subtotal = 0;
    let discountTotal = 0;
    const taxAmount = 0;

    const computedLines = input.items.map((line) => {
      const variant = variantsMap.get(line.variantId)!;
      const unitPrice = line.unitPrice ?? Number(variant.sell_price);
      const lineDiscount = line.discountAmount ?? 0;
      const lineTotal = unitPrice * line.qty - lineDiscount;
      subtotal += unitPrice * line.qty;
      discountTotal += lineDiscount;
      return {
        ...line,
        unitPrice,
        discountAmount: lineDiscount,
        lineTotal
      };
    });

    const totalAmount = subtotal - discountTotal + taxAmount;
    const paymentSum = input.payments.reduce((sum, p) => sum + p.amount, 0);

    if (Math.abs(paymentSum - totalAmount) > 0.01) {
      throw new ApiError(
        400,
        "Payment total must equal sale total (for now)",
        "PAYMENT_MISMATCH",
        { totalAmount, paymentSum }
      );
    }

    const invoiceNumber = generateInvoiceNumber(outlet.code);

    const saleRes = await client.query<{ id: string }>(
      `
      INSERT INTO sales (
        company_id,
        outlet_id,
        shift_id,
        customer_id,
        invoice_number,
        sale_datetime,
        status,
        subtotal,
        discount_amount,
        tax_amount,
        total_amount,
        note
      )
      VALUES ($1,$2,$3,$4,$5, now(), 'COMPLETED',$6,$7,$8,$9,$10)
      RETURNING id
      `,
      [
        input.companyId,
        input.outletId,
        input.shiftId || null,
        input.customerId || null,
        invoiceNumber,
        subtotal,
        discountTotal,
        taxAmount,
        totalAmount,
        input.note || null
      ]
    );

    const sale = saleRes.rows[0];

    for (const line of computedLines) {
      await client.query(
        `
        INSERT INTO sale_lines (
          sale_id,
          variant_id,
          qty,
          unit_price,
          discount_amount,
          line_total
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          sale.id,
          line.variantId,
          line.qty,
          line.unitPrice,
          line.discountAmount,
          line.lineTotal
        ]
      );
    }

    for (const pay of input.payments) {
      if (pay.amount <= 0) {
        throw new ApiError(400, "Payment amount must be > 0", "INVALID_PAYMENT_AMOUNT");
      }
      await client.query(
        `
        INSERT INTO sale_payments (
          sale_id,
          payment_method_id,
          amount,
          reference
        )
        VALUES ($1,$2,$3,$4)
        `,
        [sale.id, pay.paymentMethodId, pay.amount, pay.reference || null]
      );
    }

    const smRes = await client.query<{ id: string }>(
      `
      INSERT INTO stock_movements (
        company_id,
        source_warehouse_id,
        target_warehouse_id,
        ref_type,
        ref_id,
        movement_date,
        note
      )
      VALUES ($1,$2,NULL,'SALE',$3, now(), $4)
      RETURNING id
      `,
      [input.companyId, input.warehouseId, sale.id, `SALE ${invoiceNumber}`]
    );
    const stockMovementId = smRes.rows[0].id;

    for (const line of computedLines) {
      const qtyOut = -Math.abs(line.qty);

      await client.query(
        `
        INSERT INTO stock_movement_lines (
          stock_movement_id,
          variant_id,
          qty,
          unit_cost
        )
        VALUES ($1,$2,$3,$4)
        `,
        [stockMovementId, line.variantId, qtyOut, null]
      );

      await client.query(
        `
        INSERT INTO inventory_balances (warehouse_id, variant_id, qty, min_qty)
        VALUES ($1,$2,$3,0)
        ON CONFLICT (warehouse_id, variant_id)
        DO UPDATE SET
          qty = inventory_balances.qty + EXCLUDED.qty,
          updated_at = now()
        `,
        [input.warehouseId, line.variantId, qtyOut]
      );
    }

    return {
      saleId: sale.id,
      invoiceNumber,
      totalAmount,
      stockMovementId
    };
  });
}

export async function getSaleDetail(
  companyId: string,
  saleId: string
): Promise<SaleDetailDto> {
  const saleRows = await query<SaleDetailRow>(
    `
    SELECT s.*,
           o.name as outlet_name,
           c.name as customer_name
      FROM sales s
      JOIN outlets o ON o.id = s.outlet_id
 LEFT JOIN customers c ON c.id = s.customer_id
     WHERE s.id = $1
       AND s.company_id = $2
    `,
    [saleId, companyId]
  );
  const sale = saleRows[0];
  if (!sale) {
    throw new ApiError(404, "Sale not found", "NOT_FOUND");
  }

  const lineRows = await query<SaleLineRow>(
    `
    SELECT sl.*,
           v.name as variant_name,
           v.sku,
           p.name as product_name,
           p.code as product_code
      FROM sale_lines sl
      JOIN product_variants v ON v.id = sl.variant_id
      JOIN products p ON p.id = v.product_id
     WHERE sl.sale_id = $1
    `,
    [saleId]
  );

  const paymentRows = await query<SalePaymentRow>(
    `
    SELECT sp.*,
           pm.name as payment_method_name,
           pm.code as payment_method_code
      FROM sale_payments sp
      JOIN payment_methods pm ON pm.id = sp.payment_method_id
     WHERE sp.sale_id = $1
    `,
    [saleId]
  );

  return mapSaleDetail(sale, lineRows, paymentRows);
}

export async function listSales(
  companyId: string,
  params: ListSalesQueryDto
): Promise<SaleListItemDto[]> {
  const conds: string[] = [`s.company_id = $1`];
  const values: (string | number)[] = [companyId];
  let idx = 2;

  if (params.outletId) {
    conds.push(`s.outlet_id = $${idx++}`);
    values.push(params.outletId);
  }
  if (params.dateFrom) {
    conds.push(`s.sale_datetime >= $${idx++}`);
    values.push(params.dateFrom);
  }
  if (params.dateTo) {
    conds.push(`s.sale_datetime < $${idx++}`);
    values.push(params.dateTo);
  }

  const sql = `
    SELECT s.id,
           s.invoice_number,
           s.sale_datetime,
           s.total_amount,
           o.name as outlet_name,
           c.name as customer_name
      FROM sales s
      JOIN outlets o ON o.id = s.outlet_id
 LEFT JOIN customers c ON c.id = s.customer_id
     WHERE ${conds.join(" AND ")}
  ORDER BY s.sale_datetime DESC
  LIMIT 200
  `;

  const rows = await query<SaleListRow>(sql, values);
  return rows.map(mapSaleListRow);
}