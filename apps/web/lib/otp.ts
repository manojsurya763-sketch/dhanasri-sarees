const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong, please try again");
  }
  return data as T;
}

export function requestOtp(phone: string) {
  return postJson<{ sent: true }>("/auth/otp/request", { phone });
}

export function verifyOtp(phone: string, code: string) {
  return postJson<{ token: string; user: { id: string; phone: string } }>("/auth/otp/verify", {
    phone,
    code,
  });
}
