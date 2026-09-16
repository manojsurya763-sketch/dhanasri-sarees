// Temporary client-side stub until POST /auth/otp/request and /auth/otp/verify (Prompt 12) are live.
export async function requestOtp(phone: string) {
  await new Promise((r) => setTimeout(r, 600));
  return { sent: true, phone };
}

export async function verifyOtp(phone: string, code: string) {
  await new Promise((r) => setTimeout(r, 600));
  return { verified: code.length === 6 };
}
