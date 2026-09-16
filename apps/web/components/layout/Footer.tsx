"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/components/ui/SocialIcons";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "New Arrivals", href: "/category/all?sort=newest" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const CUSTOMER_SERVICE = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Track Order", href: "/orders" },
  { label: "FAQs", href: "/faq" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-16 bg-maroon-900 text-cream-100">
      <div className="h-2 bg-[repeating-linear-gradient(90deg,var(--color-gold-500)_0,var(--color-gold-500)_10px,transparent_10px,transparent_20px)]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <h3 className="font-[family-name:var(--font-serif-display)] text-2xl text-cream-50">
            Dhana Sri Sarees
          </h3>
          <p className="mt-3 text-sm text-cream-100/70">
            Handcrafted sarees woven for your finest moments, since 2004.
          </p>
          <div className="mt-4 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full bg-cream-50/10 p-2 hover:bg-cream-50/20">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full bg-cream-50/10 p-2 hover:bg-cream-50/20">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="X" className="rounded-full bg-cream-50/10 p-2 hover:bg-cream-50/20">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="WhatsApp" className="rounded-full bg-cream-50/10 p-2 hover:bg-cream-50/20">
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Customer Service</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream-100/80">
            {CUSTOMER_SERVICE.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-cream-50">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gold-400">Newsletter</h4>
          <p className="mt-4 text-sm text-cream-100/70">
            Subscribe for early access to new collections and exclusive offers.
          </p>
          {subscribed ? (
            <p className="mt-3 text-sm text-gold-400">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="mt-3 flex flex-col gap-2 sm:flex-row">
              <Input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-cream-50/10 text-cream-50 placeholder:text-cream-100/50 border-cream-50/20"
              />
              <Button type="submit" variant="gold" size="sm">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-cream-50/10 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-cream-100/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Dhana Sri Sarees. All rights reserved.</p>
          <select
            aria-label="Region selector"
            className="rounded-md border border-cream-50/20 bg-transparent px-2 py-1 text-cream-100/80"
            defaultValue="IN"
          >
            <option value="IN">India (₹ INR)</option>
            <option value="US">United States ($ USD)</option>
          </select>
        </div>
      </div>
    </footer>
  );
}
