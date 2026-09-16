"use client";

import { useEffect, useState } from "react";
import { PhoneInput } from "@/components/auth/PhoneInput";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/store/authStore";
import { requestOtp, verifyOtp } from "@/lib/otp";

const RESEND_SECONDS = 30;

export function OTPAuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const login = useAuthStore((s) => s.login);
  const [step, setStep] = useState<1 | 2>(1);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
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
      await requestOtp(`${countryCode}${phone}`);
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
    setError(null);
    setLoading(true);
    try {
      const res = await verifyOtp(`${countryCode}${phone}`, otp);
      login(res.token, res.user);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Incorrect OTP, please try again");
    } finally {
      setLoading(false);
    }
  }

  if (step === 1) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gold-500/60 p-6 text-center">
        <h2 className="font-[family-name:var(--font-serif-display)] text-2xl italic text-maroon-500">
          Welcome To Dhana Sri Sarees
        </h2>
        <p className="mt-3 rounded-lg bg-gold-500/10 px-3 py-2 text-sm text-maroon-900">
          Get Flat 10% OFF on Your First Order Above ₹5,000 — Use Code:{" "}
          <strong>DHANASRI10</strong>
        </p>

        <div className="mt-5 text-left">
          <PhoneInput
            countryCode={countryCode}
            onCountryCodeChange={setCountryCode}
            value={phone}
            onChange={setPhone}
          />
        </div>
        {error && <p className="mt-2 text-left text-xs text-red-600">{error}</p>}

        <Button className="mt-4 w-full" size="lg" onClick={handleSendOtp} disabled={loading}>
          {loading ? "Sending..." : "Sign Up / Login"}
        </Button>

        <p className="mt-4 text-[11px] leading-relaxed text-maroon-900/50">
          Protected by reCAPTCHA. By continuing, you agree to our Terms of
          Service and Privacy Policy.
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
