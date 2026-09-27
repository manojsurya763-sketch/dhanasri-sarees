import { z } from "zod";

const navLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

export const updateSettingsSchema = z.object({
  logoUrl: z.string().url().optional(),
  navLinks: z.array(navLinkSchema).max(10).optional(),
});

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type NavLink = z.infer<typeof navLinkSchema>;
