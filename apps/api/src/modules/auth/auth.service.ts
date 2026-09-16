import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/config/db";
import { sendOtpSms } from "@/config/sms";
import { ApiError } from "@/middleware/error-handler";

const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "30d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

function generateCode() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function requestOtp(phone: string) {
  const last = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (last && Date.now() - last.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
    const waitMs = RESEND_COOLDOWN_MS - (Date.now() - last.lastSentAt.getTime());
    throw new ApiError(429, `Please wait ${Math.ceil(waitMs / 1000)}s before requesting another OTP`);
  }

  const code = generateCode();
  const codeHash = await bcrypt.hash(code, 10);

  await prisma.otpCode.create({
    data: {
      phone,
      codeHash,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  await sendOtpSms(phone, code);
}

export async function verifyOtp(phone: string, code: string) {
  const record = await prisma.otpCode.findFirst({
    where: { phone },
    orderBy: { createdAt: "desc" },
  });

  if (!record) throw new ApiError(400, "No OTP request found for this number");
  if (record.expiresAt < new Date()) throw new ApiError(400, "OTP has expired, please request a new one");
  if (record.attempts >= MAX_VERIFY_ATTEMPTS) throw new ApiError(429, "Too many attempts, please request a new OTP");

  const matches = await bcrypt.compare(code, record.codeHash);
  if (!matches) {
    await prisma.otpCode.update({ where: { id: record.id }, data: { attempts: { increment: 1 } } });
    throw new ApiError(400, "Incorrect OTP");
  }

  await prisma.otpCode.delete({ where: { id: record.id } });

  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone },
  });

  const token = jwt.sign({ sub: user.id, phone: user.phone }, getJwtSecret(), {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);

  return { token, user: { id: user.id, phone: user.phone } };
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as { sub: string; phone: string };
}
