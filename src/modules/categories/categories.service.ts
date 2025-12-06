import { query } from "../../config/db";
import { ApiError } from "../../common/errors/ApiError";

export interface CategoryEntity {
  id: string;
  company_id: string;
  parent_id: string | null;
  name: string;
  code: string | null;
  is_active: boolean;
}

export async function createCategory(payload: {
  companyId: string;
  name: string;
  code?: string;
  parentId?: string;
}): Promise<CategoryEntity> {
  const rows = await query<CategoryEntity>(
    `INSERT INTO categories (company_id, name, code, parent_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [payload.companyId, payload.name, payload.code || null, payload.parentId || null]
  );
  return rows[0];
}

export async function listCategories(companyId: string): Promise<CategoryEntity[]> {
  const rows = await query<CategoryEntity>(
    `SELECT * FROM categories
      WHERE company_id = $1
        AND deleted_at IS NULL
      ORDER BY name`,
    [companyId]
  );
  return rows;
}

export async function getCategoryById(
  companyId: string,
  id: string
): Promise<CategoryEntity> {
  const rows = await query<CategoryEntity>(
    `SELECT * FROM categories
      WHERE id = $1
        AND company_id = $2
        AND deleted_at IS NULL`,
    [id, companyId]
  );
  const cat = rows[0];
  if (!cat) {
    throw new ApiError(404, "Category not found", "NOT_FOUND");
  }
  return cat;
}