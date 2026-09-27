import type { StaffRole } from "@/lib/types";

export type NavSection = "Overview" | "Catalog & Orders" | "Customer Ops" | "My Work" | "Administration";

export interface NavItem {
  href: string;
  label: string;
  roles: StaffRole[];
  section: NavSection;
}

// Single source of truth for the sidebar — later features append their own
// entries here rather than inventing a new pattern. Order here is also
// render order, grouped by `section` (see DashboardLayout).
export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["super_admin", "admin"], section: "Overview" },
  { href: "/analytics", label: "Analytics", roles: ["super_admin"], section: "Overview" },
  { href: "/engagement", label: "Engagement", roles: ["super_admin"], section: "Overview" },

  { href: "/products", label: "Products", roles: ["super_admin", "admin"], section: "Catalog & Orders" },
  { href: "/inventory", label: "Inventory", roles: ["super_admin", "admin", "employee"], section: "Catalog & Orders" },
  { href: "/orders", label: "Orders", roles: ["super_admin", "admin", "employee"], section: "Catalog & Orders" },
  { href: "/discounts", label: "Discounts", roles: ["super_admin"], section: "Catalog & Orders" },

  { href: "/customers", label: "Customers", roles: ["super_admin", "admin", "employee"], section: "Customer Ops" },
  { href: "/returns", label: "Returns", roles: ["super_admin", "admin", "employee"], section: "Customer Ops" },
  { href: "/reviews", label: "Reviews", roles: ["super_admin", "admin", "employee"], section: "Customer Ops" },

  { href: "/attendance", label: "My Attendance", roles: ["employee", "super_admin"], section: "My Work" },

  { href: "/settings", label: "Settings", roles: ["super_admin"], section: "Administration" },
  { href: "/staff", label: "Staff", roles: ["super_admin"], section: "Administration" },
];

// Sub-routes reached via a button/link rather than the sidebar, whose role
// requirement is narrower than the section they live under (e.g. any staff
// can view Returns, but only Admin+ can log a new one). Checked before
// NAV_ITEMS in isRouteAllowed, so the more specific rule wins. Never
// rendered as a nav item, so no `section`.
const ROUTE_OVERRIDES: { href: string; roles: StaffRole[] }[] = [
  { href: "/returns/new", roles: ["super_admin", "admin"] },
];

export const DEFAULT_ROUTE: Record<StaffRole, string> = {
  super_admin: "/dashboard",
  admin: "/dashboard",
  employee: "/orders",
};

export function isRouteAllowed(pathname: string, role: StaffRole): boolean {
  const override = ROUTE_OVERRIDES.find((i) => pathname.startsWith(i.href));
  if (override) return override.roles.includes(role);

  const item = NAV_ITEMS.find((i) => pathname.startsWith(i.href));
  return item ? item.roles.includes(role) : true; // unmapped route: fail open, not lock out on a typo
}
