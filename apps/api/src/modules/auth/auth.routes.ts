import { Router } from "express";
import { createSession } from "@/modules/auth/session.controller";

export const authRouter = Router();

authRouter.post("/session", createSession);
