import type { Request, Response } from "express";
import { updateSettingsSchema } from "@/modules/settings/settings.schema";
import { getSiteSettings, updateSiteSettings } from "@/modules/settings/settings.repo";

export async function getSettings(_req: Request, res: Response) {
  const settings = await getSiteSettings();
  res.json({ logoUrl: settings.logoUrl, navLinks: settings.navLinks });
}

export async function updateSettings(req: Request, res: Response) {
  const data = updateSettingsSchema.parse(req.body);
  const settings = await updateSiteSettings(data);
  res.json({ logoUrl: settings.logoUrl, navLinks: settings.navLinks });
}
