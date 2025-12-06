import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface BrandEntity {
  id: string;
  company_id: string;
  name: string;
  code: string | null;
  is_active: boolean;
}

export async function createBrand(payload: {
  companyId: string;
  name: string;
  code?: string;
}): Promise<BrandEntity> {
  const rows = await query<BrandEntity>(
    `INSERT INTO brands (company_id, name, code)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [payload.companyId, payload.name, payload.code || null]
  );
  return rows[0];
}

export async function listBrands(companyId: string): Promise<BrandEntity[]> {
  const rows = await query<BrandEntity>(
    `SELECT * FROM brands
      WHERE company_id = $1
        AND deleted_at IS NULL
      ORDER BY name`,
    [companyId]
  );
  return rows;
}

export async function getBrandById(companyId: string, id: string): Promise<BrandEntity> {
  const rows = await query<BrandEntity>(
    `SELECT * FROM brands
      WHERE id = $1
        AND company_id = $2
        AND deleted_at IS NULL`,
    [id, companyId]
  );
  const brand = rows[0];
  if (!brand) {
    throw new ApiError(404, "Brand not found", "NOT_FOUND");
  }
  return brand;
}