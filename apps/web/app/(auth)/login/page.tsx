"use client";

import { useRouter } from "next/navigation";
import { OTPAuthForm } from "@/components/auth/OTPAuthForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-12 sm:px-6">
      <div className="w-full">
        <OTPAuthForm onSuccess={() => router.push("/")} />
      </div>
    </div>
  );
}
