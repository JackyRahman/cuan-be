import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface OutletEntity {
  id: string;
  company_id: string;
  name: string;
  code: string | null;
  address: string | null;
  phone: string | null;
  is_active: boolean;
}

export async function createOutlet(payload: {
  companyId: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
}): Promise<OutletEntity> {
  const rows = await query<OutletEntity>(
    `INSERT INTO outlets (company_id, name, code, address, phone)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      payload.companyId,
      payload.name,
      payload.code || null,
      payload.address || null,
      payload.phone || null
    ]
  );
  return rows[0];
}

export async function getOutlets(companyId: string): Promise<OutletEntity[]> {
  const rows = await query<OutletEntity>(
    `SELECT * FROM outlets
      WHERE company_id = $1
        AND deleted_at IS NULL
      ORDER BY name`,
    [companyId]
  );
  return rows;
}

export async function getOutletById(
  companyId: string,
  outletId: string
): Promise<OutletEntity> {
  const rows = await query<OutletEntity>(
    `SELECT * FROM outlets
      WHERE id = $1
        AND company_id = $2
        AND deleted_at IS NULL`,
    [outletId, companyId]
  );
  const outlet = rows[0];
  if (!outlet) {
    throw new ApiError(404, "Outlet not found", "NOT_FOUND");
  }
  return outlet;
}