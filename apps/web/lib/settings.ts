import "server-only";
import type { NavLink } from "@/lib/types";

const API_URL = process.env.API_URL ?? "http://localhost:4000";

export interface SiteSettings {
  logoUrl: string | null;
  navLinks: NavLink[] | null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_URL}/settings`, { cache: "no-store" });
    if (!res.ok) return { logoUrl: null, navLinks: null };
    const data = await res.json();
    return { logoUrl: data.logoUrl ?? null, navLinks: data.navLinks ?? null };
  } catch {
    return { logoUrl: null, navLinks: null };
  }
}
