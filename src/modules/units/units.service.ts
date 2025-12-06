import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface UnitEntity {
  id: string;
  company_id: string;
  name: string;
  short_name: string | null;
  code: string | null;
  is_active: boolean;
}

export async function createUnit(payload: {
  companyId: string;
  name: string;
  shortName?: string;
  code?: string;
}): Promise<UnitEntity> {
  const rows = await query<UnitEntity>(
    `INSERT INTO units (company_id, name, short_name, code)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.companyId, payload.name, payload.shortName || null, payload.code || null]
  );
  return rows[0];
}

export async function listUnits(companyId: string): Promise<UnitEntity[]> {
  const rows = await query<UnitEntity>(
    `SELECT * FROM units
      WHERE company_id = $1
        AND deleted_at IS NULL
      ORDER BY name`,
    [companyId]
  );
  return rows;
}

export async function getUnitById(companyId: string, id: string): Promise<UnitEntity> {
  const rows = await query<UnitEntity>(
    `SELECT * FROM units
      WHERE id = $1
        AND company_id = $2
        AND deleted_at IS NULL`,
    [id, companyId]
  );
  const unit = rows[0];
  if (!unit) {
    throw new ApiError(404, "Unit not found", "NOT_FOUND");
  }
  return unit;
}