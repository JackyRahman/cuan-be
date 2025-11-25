import { query } from "../../config/db";

export interface UserEntity {
  id: string;
  company_id: string;
  full_name: string;
  username: string;
  email: string | null;
  password_hash: string;
  is_active: boolean;
}

export async function findUserByUsername(
  companyId: string,
  username: string
): Promise<UserEntity | null> {
  const rows = await query<UserEntity>(
    `SELECT * FROM users
     WHERE company_id = $1
       AND username = $2
       AND deleted_at IS NULL
     LIMIT 1`,
    [companyId, username]
  );
  return rows[0] || null;
}

export async function createUser(payload: {
  companyId: string;
  fullName: string;
  username: string;
  email?: string;
  passwordHash: string;
}): Promise<UserEntity> {
  const rows = await query<UserEntity>(
    `INSERT INTO users (company_id, full_name, username, email, password_hash)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      payload.companyId,
      payload.fullName,
      payload.username,
      payload.email || null,
      payload.passwordHash
    ]
  );
  return rows[0];
}