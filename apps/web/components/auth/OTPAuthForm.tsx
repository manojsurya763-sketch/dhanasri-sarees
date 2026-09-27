"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Sparkle } from "lucide-react";
import type { ConfirmationResult } from "firebase/auth";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { requestOtp, verifyOtp } from "@/lib/otp";

const RESEND_SECONDS = 30;

export function OTPAuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  async function handleSendOtp() {
    if (phone.length !== 10) {
      setError("Enter a valid 10-digit phone number");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const result = await requestOtp(`${countryCode}${phone}`);
      setConfirmation(result);
      setStep(2);
      setResendIn(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send OTP, please try again");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    if (!confirmation) {
      setError("Session expired, please request a new OTP");
      setStep(1);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(confirmation, otp);
      // authStore updates automatically via AuthListener's onAuthStateChanged subscription.
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect OTP, please try again");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="text-center">
        <div className="relative mx-auto aspect-[800/508] w-full">
          <Image src="/images/auth-banner.png" alt="" fill priority sizes="480px" className="object-contain" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-12 py-8 sm:px-20 sm:py-10">
            <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.25em] text-maroon-900/70 sm:text-[11px]">
              <Sparkle className="h-2.5 w-2.5 shrink-0 fill-gold-500 text-gold-500" />
              WELCOME TO
              <Sparkle className="h-2.5 w-2.5 shrink-0 fill-gold-500 text-gold-500" />
            </p>

            <div className="relative h-10 w-10 sm:h-12 sm:w-12">
              <Image src="/images/auth-emblem.png" alt="" fill sizes="48px" className="object-contain" />
            </div>

            <h2 className="font-[family-name:var(--font-serif-display)] text-base italic leading-tight text-maroon-500 sm:text-xl">
              Dhana Sri Sarees
            </h2>

            <p className="text-center text-[9px] leading-snug text-maroon-900/70 sm:text-[11px]">
              Get Flat 10% OFF on Your First Order Above ₹5,000
              <br />
              Use Code: <strong>DHANASRI10</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 text-left">
          <PhoneInput
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            value={phone}
            onChange={setPhone}
          />
        </div>
        {error && <p className="mt-2 text-left text-xs text-red-600">{error}</p>}

        <div id="recaptcha-container" />

        <Button className="mt-4 w-full rounded-lg" size="lg" onClick={handleSendOtp} disabled={loading}>
          {loading ? "Sending..." : "Sign Up / Login"}
        </Button>

        <p className="mt-4 text-[11px] leading-relaxed text-maroon-900/50">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="#" className="text-maroon-500 hover:underline">
            Privacy Policy
          </a>{" "}
          &{" "}
          <a href="#" className="text-maroon-500 hover:underline">
            Terms of Service
          </a>{" "}
          apply.
          <br />
          By continuing, I agree to Terms of Use &amp; Privacy Notice
        </p>
      </div>
    );
  }

  return (
    <div className="p-2 text-center">
      <h2 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">
        Verify Your Number
      </h2>
      <p className="mt-2 text-sm text-maroon-900/60">
        Enter the 6-digit code sent to {countryCode} {phone}
      </p>

      <div className="mt-5">
        <Input
          inputMode="numeric"
          maxLength={6}
          placeholder="••••••"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="text-center text-lg tracking-[0.4em]"
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      <Button className="mt-4 w-full" size="lg" onClick={handleVerify} disabled={loading}>
        {loading ? "Verifying..." : "Verify & Continue"}
      </Button>

      <button
        disabled={resendIn > 0}
        onClick={handleSendOtp}
        className="mt-4 text-xs font-medium text-maroon-500 disabled:text-maroon-900/40"
      >
        {resendIn > 0 ? `Resend OTP in ${resendIn}s` : "Resend OTP"}
      </button>
    </div>
  );
}
