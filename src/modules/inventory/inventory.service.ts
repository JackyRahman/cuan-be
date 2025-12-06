import { PoolClient } from "pg";
import { query, withTransaction } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface InventoryBalance {
  id: string;
  warehouse_id: string;
  variant_id: string;
  qty: string;
  min_qty: string;
}

export async function getInventoryByWarehouseForCompany(
  companyId: string,
  warehouseId: string
): Promise<any[]> {
  const wh = await query<{ id: string }>(
    `
    SELECT w.id
      FROM warehouses w
      JOIN outlets o ON o.id = w.outlet_id
     WHERE w.id = $1
       AND o.company_id = $2
       AND w.deleted_at IS NULL
    `,
    [warehouseId, companyId]
  );
  if (!wh[0]) {
    throw new ApiError(404, "Warehouse not found", "NOT_FOUND");
  }

  const rows = await query<any>(
    `
    SELECT
      ib.id,
      ib.warehouse_id,
      ib.variant_id,
      ib.qty,
      ib.min_qty,
      v.name as variant_name,
      v.sku,
      p.name as product_name,
      p.code as product_code
    FROM inventory_balances ib
    JOIN product_variants v ON v.id = ib.variant_id
    JOIN products p ON p.id = v.product_id
    WHERE ib.warehouse_id = $1
    ORDER BY p.name, v.name
    `,
    [warehouseId]
  );

  return rows;
}

interface StockAdjustLine {
  variantId: string;
  qtyDiff: number;
  unitCost?: number;
}

export async function adjustStock(
  companyId: string,
  warehouseId: string,
  note: string | undefined,
  lines: StockAdjustLine[]
): Promise<{ stockMovementId: string }> {
  if (lines.length === 0) {
    throw new ApiError(400, "Lines cannot be empty", "EMPTY_LINES");
  }

  return withTransaction<{ stockMovementId: string }>(async (client: PoolClient) => {
    const whRes = await client.query(
      `
      SELECT w.id
        FROM warehouses w
        JOIN outlets o ON o.id = w.outlet_id
       WHERE w.id = $1
         AND o.company_id = $2
         AND w.deleted_at IS NULL
      `,
      [warehouseId, companyId]
    );
    if (!whRes.rows[0]) {
      throw new ApiError(404, "Warehouse not found", "NOT_FOUND");
    }

    const smRes = await client.query(
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
      VALUES ($1, $2, NULL, 'ADJUSTMENT', NULL, now(), $3)
      RETURNING id
      `,
      [companyId, warehouseId, note || null]
    );
    const stockMovementId = smRes.rows[0].id as string;

    for (const line of lines) {
      if (line.qtyDiff === 0) continue;

      await client.query(
        `
        INSERT INTO stock_movement_lines (
          stock_movement_id,
          variant_id,
          qty,
          unit_cost
        )
        VALUES ($1, $2, $3, $4)
        `,
        [stockMovementId, line.variantId, line.qtyDiff, line.unitCost ?? null]
      );

      await client.query(
        `
        INSERT INTO inventory_balances (warehouse_id, variant_id, qty, min_qty)
        VALUES ($1, $2, $3, 0)
        ON CONFLICT (warehouse_id, variant_id)
        DO UPDATE SET
          qty = inventory_balances.qty + EXCLUDED.qty,
          updated_at = now()
        `,
        [warehouseId, line.variantId, line.qtyDiff]
      );
    }

    return { stockMovementId };
  });
}