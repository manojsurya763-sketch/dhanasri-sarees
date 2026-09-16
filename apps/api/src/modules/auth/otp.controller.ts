import type { Request, Response } from "express";
import { requestOtpSchema, verifyOtpSchema } from "@/modules/auth/auth.schema";
import { requestOtp, verifyOtp } from "@/modules/auth/auth.service";

export async function requestOtpHandler(req: Request, res: Response) {
  const { phone } = requestOtpSchema.parse(req.body);
  await requestOtp(phone);
  res.json({ sent: true });
}

export async function verifyOtpHandler(req: Request, res: Response) {
  const { phone, code } = verifyOtpSchema.parse(req.body);
  const { token, user } = await verifyOtp(phone, code);
  res.json({ token, user });
}
