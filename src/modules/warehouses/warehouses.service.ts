import type { CreateWarehouseDto } from "./warehouses.dto";
import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface WarehouseEntity {
  id: string;
  outlet_id: string;
  name: string;
  code: string | null;
  type: string;
  is_active: boolean;
}

export async function createWarehouse(payload: CreateWarehouseDto): Promise<WarehouseEntity> {
  const rows = await query<WarehouseEntity>(
    `INSERT INTO warehouses (outlet_id, name, code, type)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.outletId, payload.name, payload.code || null, payload.type || "WAREHOUSE"]
  );
  return rows[0];
}

export async function listWarehousesByCompany(companyId: string): Promise<WarehouseEntity[]> {
  const rows = await query<WarehouseEntity>(
    `
    SELECT w.*
      FROM warehouses w
      JOIN outlets o ON o.id = w.outlet_id
     WHERE o.company_id = $1
       AND w.deleted_at IS NULL
     ORDER BY o.name, w.name
    `,
    [companyId]
  );
  return rows;
}

export async function getWarehouseByIdForCompany(
  companyId: string,
  warehouseId: string
): Promise<WarehouseEntity> {
  const rows = await query<WarehouseEntity>(
    `
    SELECT w.*
      FROM warehouses w
      JOIN outlets o ON o.id = w.outlet_id
     WHERE w.id = $1
       AND o.company_id = $2
       AND w.deleted_at IS NULL
    `,
    [warehouseId, companyId]
  );
  const wh = rows[0];
  if (!wh) {
    throw new ApiError(404, "Warehouse not found", "NOT_FOUND");
  }
  return wh;
}