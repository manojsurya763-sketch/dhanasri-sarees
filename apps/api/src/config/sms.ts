import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Falls back to logging the code when Twilio credentials aren't configured,
// so OTP login is testable on a fresh deploy before SMS is wired up.
export async function sendOtpSms(phone: string, code: string): Promise<void> {
  if (!client || !fromNumber) {
    console.log(`[dev-otp] OTP for ${phone}: ${code}`);
    return;
  }

  await client.messages.create({
    to: phone,
    from: fromNumber,
    body: `Your Dhana Sri Sarees verification code is ${code}. It expires in 5 minutes.`,
  });
}

export const smsProviderConfigured = Boolean(client && fromNumber);
