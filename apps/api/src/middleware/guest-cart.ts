import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

const COOKIE_NAME = "guestId";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      guestId: string;
    }
  }
}

// Identifies the shopper's cart before real auth (Prompt 12) is wired in.
// Once a JWT session exists, the auth middleware should resolve userId instead.
export function guestCart(req: Request, res: Response, next: NextFunction) {
  let guestId = req.cookies?.[COOKIE_NAME];
  if (!guestId) {
    guestId = randomUUID();
    res.cookie(COOKIE_NAME, guestId, {
      maxAge: ONE_YEAR_MS,
      httpOnly: true,
      sameSite: "lax",
    });
  }
  req.guestId = guestId;
  next();
}
