import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth";
import { auth, getIdToken } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const RECAPTCHA_CONTAINER_ID = "recaptcha-container";

let recaptchaVerifier: RecaptchaVerifier | null = null;

function getRecaptchaVerifier() {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, { size: "invisible" });
  }
  return recaptchaVerifier;
}

export async function requestOtp(phone: string): Promise<ConfirmationResult> {
  return signInWithPhoneNumber(auth, phone, getRecaptchaVerifier());
}

// Resolves once the code is verified with Firebase and the resulting session
// has been synced to our own backend (so a Postgres/Firestore user record exists).
export async function verifyOtp(confirmation: ConfirmationResult, code: string): Promise<void> {
  await confirmation.confirm(code);

  const idToken = await getIdToken();
  const res = await fetch(`${API_URL}/auth/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Signed in, but couldn't sync your account — please try again");
  }
}
