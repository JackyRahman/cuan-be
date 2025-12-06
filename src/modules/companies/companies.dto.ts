import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).optional(),
  taxId: z.string().optional(),
  address: z.string().optional()
});

export type CreateCompanyDto = z.infer<typeof createCompanySchema>;