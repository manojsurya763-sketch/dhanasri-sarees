"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import clsx from "clsx";
import { auth } from "@/lib/firebase";
import { useAdminAuthStore } from "@/store/adminAuthStore";
import { DEFAULT_ROUTE, NAV_ITEMS, isRouteAllowed } from "@/lib/access";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, isStaff, initialized } = useAdminAuthStore();

  useEffect(() => {
    if (!initialized) return;
    if (!isStaff || !role) {
      router.replace("/login");
      return;
    }
    if (!isRouteAllowed(pathname ?? "", role)) router.replace(DEFAULT_ROUTE[role]);
  }, [initialized, isStaff, role, pathname, router]);

  if (!initialized || !isStaff || !role || !isRouteAllowed(pathname ?? "", role)) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading…</div>;
  }

  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const sections = Array.from(new Set(visibleNavItems.map((item) => item.section)));

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-slate-200 bg-white p-4">
        <p className="mb-6 text-sm font-semibold text-slate-900">Dhana Sri Sarees</p>
        <nav className="space-y-4">
          {sections.map((section) => (
            <div key={section}>
              <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">{section}</p>
              <div className="space-y-1">
                {visibleNavItems
                  .filter((item) => item.section === section)
                  .map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "block rounded-md px-3 py-2 text-sm font-medium",
                        pathname?.startsWith(item.href)
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-8 border-t border-slate-200 pt-4">
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
          <p className="text-xs capitalize text-slate-400">{role.replace("_", " ")}</p>
          <button
            onClick={() => signOut(auth)}
            className="mt-2 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
