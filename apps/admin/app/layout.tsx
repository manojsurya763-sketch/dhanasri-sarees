import type { Metadata } from "next";
import { AdminAuthListener } from "@/components/auth/AdminAuthListener";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dhana Sri Sarees — Admin",
  description: "Product, inventory and order management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        {children}
        <AdminAuthListener />
      </body>
    </html>
  );
}
