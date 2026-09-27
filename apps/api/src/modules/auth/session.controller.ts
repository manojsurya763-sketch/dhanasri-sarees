import type { Request, Response } from "express";
import { firebaseAuth } from "@/config/firebaseAdmin";
import { prisma } from "@/config/db";
import { ApiError } from "@/middleware/error-handler";

// Called once right after a successful Firebase phone sign-in, to sync that
// login into our own Postgres `users` table. Every later request just needs
// the Firebase ID token (see auth.guard.ts) — no separate session token.
export async function createSession(req: Request, res: Response) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw new ApiError(401, "Missing Firebase ID token");
  const token = header.slice("Bearer ".length);

  const decoded = await firebaseAuth.verifyIdToken(token).catch(() => {
    throw new ApiError(401, "Invalid or expired Firebase session");
  });
  if (!decoded.phone_number) throw new ApiError(400, "Token has no phone number");

  const existing = await prisma.user.findUnique({ where: { phone: decoded.phone_number } });
  const user = existing ?? (await prisma.user.create({ data: { id: decoded.uid, phone: decoded.phone_number } }));

  res.json({ user: { id: user.id, phone: user.phone } });
}
