import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface CompanyEntity {
  id: string;
  name: string;
  code: string | null;
  tax_id: string | null;
  address: string | null;
  is_active: boolean;
}

export async function createCompany(payload: {
  name: string;
  code?: string;
  taxId?: string;
  address?: string;
}): Promise<CompanyEntity> {
  const rows = await query<CompanyEntity>(
    `INSERT INTO companies (name, code, tax_id, address)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.name, payload.code || null, payload.taxId || null, payload.address || null]
  );
  return rows[0];
}

export async function getCompanies(): Promise<CompanyEntity[]> {
  const rows = await query<CompanyEntity>(
    `SELECT * FROM companies WHERE deleted_at IS NULL ORDER BY name`
  );
  return rows;
}

export async function getCompanyById(id: string): Promise<CompanyEntity> {
  const rows = await query<CompanyEntity>(
    `SELECT * FROM companies WHERE id = $1 AND deleted_at IS NULL`,
    [id]
  );
  const company = rows[0];
  if (!company) {
    throw new ApiError(404, "Company not found", "NOT_FOUND");
  }
  return company;
}
