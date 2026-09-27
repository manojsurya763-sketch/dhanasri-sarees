"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import type { NavLink as NavLinkType } from "@/lib/types";

// Falls back to this default set whenever the admin hasn't configured a
// custom nav menu (see Settings → Navigation menu in apps/admin).
const DEFAULT_NAV_LINKS = [
  { label: "New Arrivals", href: "/category/all?sort=newest" },
  { label: "Wedding", href: "/category/wedding" },
  { label: "Festive", href: "/category/festive" },
  { label: "Casual", href: "/category/casual" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

function IconLink({
  href,
  label,
  children,
  count,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <Link href={href} aria-label={label} className="relative p-2 text-cream-50 hover:text-gold-400">
      {children}
      {typeof count === "number" && count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-maroon-900">
          {count}
        </span>
      )}
    </Link>
  );
}

export function Header({ logoUrl, navLinks }: { logoUrl: string | null; navLinks: NavLinkType[] | null }) {
  const links = navLinks && navLinks.length > 0 ? navLinks : DEFAULT_NAV_LINKS;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const openCartDrawer = useUiStore((s) => s.openCartDrawer);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <header className="sticky top-0 z-40 border-b border-maroon-900/40 bg-maroon-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          className="p-2 text-cream-50 lg:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="shrink-0">
          <Image
            src={logoUrl || "/images/logo.png"}
            alt="Dhana Sri Sarees"
            width={160}
            height={48}
            className="h-10 w-auto sm:h-12"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-cream-50 hover:text-gold-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2 text-cream-50 hover:text-gold-400"
          >
            <Search className="h-5 w-5" />
          </button>
          {isAuthenticated ? (
            <IconLink href="/orders" label="My Orders">
              <User className="h-5 w-5 fill-gold-500 text-gold-400" />
            </IconLink>
          ) : (
            <button
              aria-label="Account"
              onClick={openAuthModal}
              className="relative p-2 text-cream-50 hover:text-gold-400"
            >
              <User className="h-5 w-5" />
            </button>
          )}
          <IconLink href="/wishlist" label="Wishlist" count={wishlistCount}>
            <Heart className="h-5 w-5" />
          </IconLink>
          <button
            aria-label="Cart"
            onClick={openCartDrawer}
            className="relative p-2 text-cream-50 hover:text-gold-400"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-semibold text-maroon-900">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-maroon-900/40 px-4 py-3 sm:px-6">
          <input
            autoFocus
            type="search"
            placeholder="Search for sarees..."
            className="w-full rounded-lg border border-maroon-500/20 bg-white px-4 py-2 text-sm text-maroon-900 placeholder:text-maroon-900/40 focus:outline-none focus:ring-2 focus:ring-maroon-500/40"
          />
        </div>
      )}

      <nav
        className={cn(
          "lg:hidden overflow-hidden border-t border-maroon-900/40 transition-[max-height]",
          mobileOpen ? "max-h-96" : "max-h-0 border-t-0"
        )}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-cream-50 hover:bg-maroon-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
