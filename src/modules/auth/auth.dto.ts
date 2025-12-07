import { z } from "zod";

export const registerSchema = z.object({
  companyId: z.string().uuid(),
  fullName: z.string().min(1),
  username: z.string().min(3),
  email: z.string().email().optional(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  companyCode: z.string().min(1).default("CUAN"),
  username: z.string().min(1),
  password: z.string().min(1)
});

export type RegisterOwnerDto = z.infer<typeof registerSchema>;
export type LoginDto = z.infer<typeof loginSchema>;