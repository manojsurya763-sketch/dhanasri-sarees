import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Montserrat, Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OTPAuthModal } from "@/components/auth/OTPAuthModal";
import { AuthListener } from "@/components/auth/AuthListener";
import { getSiteSettings } from "@/lib/settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["700"],
  style: ["italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dhana Sri Sarees",
  description: "Woven for Your Finest Moments — handcrafted sarees for every occasion.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { logoUrl, navLinks } = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AnnouncementBar />
        <Header logoUrl={logoUrl} navLinks={navLinks} />
        <main className="flex-1">{children}</main>
        <Footer logoUrl={logoUrl} />
        <CartDrawer />
        <OTPAuthModal />
        <AuthListener />
      </body>
    </html>
  );
}
