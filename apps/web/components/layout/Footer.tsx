"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { FacebookIcon, InstagramIcon, WhatsAppIcon, XIcon } from "@/components/ui/SocialIcons";
import { OrnamentIcon } from "@/components/ui/OrnamentIcon";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Sarees", href: "/category/all" },
  { label: "New Arrivals", href: "/category/all?sort=newest" },
];

const CUSTOMER_SERVICE = [
  { label: "Contact us", href: "/contact" },
  { label: "Privacy Policies", href: "/privacy-policy" },
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "Terms & Condition", href: "/terms" },
  { label: "Shipping & Delivery", href: "/shipping-policy" },
  { label: "Refund and Cancellation", href: "/returns" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Facebook", Icon: FacebookIcon },
  { label: "X", Icon: XIcon },
  { label: "WhatsApp", Icon: WhatsAppIcon },
];

export function Footer({ logoUrl }: { logoUrl: string | null }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  }

  return (
    <footer className="relative mt-16 bg-maroon-500 text-cream-100">
      <div
        className="h-16 sm:h-20"
        style={{
          backgroundImage: "url(/images/footer-border.png)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 100%",
          backgroundPosition: "top center",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6">
        <Image src={logoUrl || "/images/logo.png"} alt="Dhana Sri Sarees" width={220} height={66} className="h-14 w-auto" />

        <div className="my-5 flex justify-center">
          <span className="h-1 w-10 rounded-full bg-gold-500" />
        </div>

        <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-3">
          <div>
            <h4 className="font-[family-name:var(--font-serif-display)] text-lg text-cream-50">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-100/80">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cream-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-serif-display)] text-lg text-cream-50">Customer Service</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-cream-100/80">
              {CUSTOMER_SERVICE.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-cream-50">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-serif-display)] text-lg text-cream-50">Newsletter</h4>
            <p className="mt-4 text-sm text-cream-100/70">
              Subscribe to our newsletter and get our hot new updates!
            </p>
            {subscribed ? (
              <p className="mt-3 text-sm text-gold-400">Thank you for subscribing!</p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-3 flex items-center rounded-full border border-gold-500/40 bg-cream-50/5 py-1 pl-4 pr-1"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter Your Email ID"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-w-0 flex-1 bg-transparent text-sm text-cream-50 placeholder:text-cream-100/50 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-maroon-900 hover:bg-gold-600"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            <h4 className="mt-8 font-[family-name:var(--font-serif-display)] text-lg text-cream-50">Follow us</h4>
            <p className="mt-2 text-sm text-cream-100/70">Connect with us on social media for news and updates.</p>
            <div className="mt-3 flex gap-3">
              {SOCIAL_LINKS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 text-gold-400 hover:bg-gold-500/25"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pb-6">
          <span className="h-px flex-1 max-w-24 bg-cream-50/15" />
          <OrnamentIcon className="h-6 w-6" />
          <span className="h-px flex-1 max-w-24 bg-cream-50/15" />
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
