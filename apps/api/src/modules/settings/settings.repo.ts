import { prisma } from "@/config/db";
import type { UpdateSettingsInput } from "@/modules/settings/settings.schema";

const SETTINGS_ID = "main";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: SETTINGS_ID } });
  return settings ?? { id: SETTINGS_ID, logoUrl: null, navLinks: null, updatedAt: new Date() };
}

export function updateSiteSettings(data: UpdateSettingsInput) {
  return prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: data,
    create: { id: SETTINGS_ID, ...data },
  });
}
