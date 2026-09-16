import { Router } from "express";
import express from "express";
import { handleRazorpayWebhook } from "@/modules/webhooks/razorpay.controller";

export const razorpayWebhookRouter = Router();

// Raw body is required to verify the Razorpay signature — do not apply express.json() to this route.
razorpayWebhookRouter.post("/", express.raw({ type: "application/json" }), handleRazorpayWebhook);
