import { z } from "zod";
import { StaffRole } from "@prisma/client";

export const createStaffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
  role: z.nativeEnum(StaffRole),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;

export const updateStaffRoleSchema = z.object({
  role: z.nativeEnum(StaffRole),
});
