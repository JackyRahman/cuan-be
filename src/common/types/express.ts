import { Request } from "express";

export interface AuthUser {
  id: string;
  companyId: string;
  username: string;
  roles: string[];
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}