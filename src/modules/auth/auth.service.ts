import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "../../config/env";
import { ApiError } from "../../common/errors/ApiError";
import { query } from "../../config/db";
import { createUser, findUserByUsername, UserEntity } from "../users/users.repository";
import type { LoginDto, RegisterOwnerDto } from "./auth.dto";

interface LoginResult {
  token: string;
  user: {
    id: string;
    full_name: string;
    username: string;
    company_id: string;
    roles: string[];
  };
}

async function hasOwnerUser(companyId: string): Promise<boolean> {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*)::text AS count
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
      WHERE ur.outlet_id IS NULL
        AND r.name = 'OWNER'
        AND ur.user_id IN (
          SELECT id FROM users WHERE company_id = $1 AND deleted_at IS NULL
        )`,
    [companyId]
  );
  return parseInt(rows[0]?.count || "0", 10) > 0;
}

export async function registerOwner(payload: RegisterOwnerDto): Promise<UserEntity> {
  const ownerExists = await hasOwnerUser(payload.companyId);
  if (ownerExists) {
    throw new ApiError(400, "Owner already exists for this company", "OWNER_EXISTS");
  }

  const hashed = await bcrypt.hash(payload.password, 10);
  const user = await createUser({
    companyId: payload.companyId,
    fullName: payload.fullName,
    username: payload.username,
    email: payload.email,
    passwordHash: hashed
  });

  const roles = await query<{ id: string }>(
    `SELECT id FROM roles WHERE name = 'OWNER' LIMIT 1`
  );

  if (roles[0]) {
    await query(
      `INSERT INTO user_roles (user_id, role_id, outlet_id)
       VALUES ($1, $2, NULL)`,
      [user.id, roles[0].id]
    );
  }

  return user;
}

export async function login(payload: LoginDto): Promise<LoginResult> {
  const companies = await query<{ id: string; code: string }>(
    `SELECT id, code FROM companies
      WHERE code = $1
        AND deleted_at IS NULL`,
    [payload.companyCode]
  );
  const company = companies[0];
  if (!company) {
    throw new ApiError(400, "Invalid company", "INVALID_COMPANY");
  }

  const user = await findUserByUsername(company.id, payload.username);
  if (!user || !user.is_active) {
    throw new ApiError(401, "Invalid credentials", "INVALID_LOGIN");
  }

  const ok = await bcrypt.compare(payload.password, user.password_hash);
  if (!ok) {
    throw new ApiError(401, "Invalid credentials", "INVALID_LOGIN");
  }

  const rolesRows = await query<{ name: string }>(
    `SELECT r.name
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = $1`,
    [user.id]
  );
  const roles = rolesRows.map((r) => r.name);

  const jwtPayload: jwt.JwtPayload = {
    id: user.id,
    companyId: user.company_id,
    username: user.username,
    roles
  };

  const signOptions: jwt.SignOptions = {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions["expiresIn"]
  };

  const token = jwt.sign(jwtPayload, env.jwt.secret as jwt.Secret, signOptions);

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      username: user.username,
      company_id: user.company_id,
      roles
    }
  };
}