import { Router } from "express";
import { requestOtpHandler, verifyOtpHandler } from "@/modules/auth/otp.controller";

export const authRouter = Router();

authRouter.post("/otp/request", requestOtpHandler);
authRouter.post("/otp/verify", verifyOtpHandler);
