import Razorpay from "razorpay";

let client: Razorpay | null = null;

// Instantiated lazily so a missing key only breaks checkout, not the whole server on boot.
export function getRazorpay(): Razorpay {
  if (client) return client;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not configured");
  }

  client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}
