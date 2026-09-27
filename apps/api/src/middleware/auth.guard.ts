import type { NextFunction, Request, Response } from "express";
import type { StaffRole } from "@prisma/client";
import { firebaseAuth } from "@/config/firebaseAdmin";
import { prisma } from "@/config/db";
import { ApiError } from "@/middleware/error-handler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      staff?: { id: string; role: StaffRole; email: string; firebaseUid: string };
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

// Resolves a verified Firebase token to our own Postgres user id (keyed by
// phone, not the Firebase uid directly — keeps this stable even if a user
// row already existed under a different id, and is what Order.userId etc.
// actually foreign-keys against).
async function resolveUserId(token: string): Promise<string> {
  const decoded = await firebaseAuth.verifyIdToken(token);
  if (!decoded.phone_number) throw new ApiError(401, "Invalid session: no phone number on token");

  const user = await prisma.user.findUnique({ where: { phone: decoded.phone_number } });
  if (!user) throw new ApiError(401, "Account not found — please log in again");
  if (!user.isActive) throw new ApiError(403, "Account deactivated");
  return user.id;
}

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Login required");

  try {
    req.userId = await resolveUserId(token);
    next();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(401, "Invalid or expired session");
  }
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.userId = await resolveUserId(token);
    } catch {
      // ignore invalid token, request proceeds unauthenticated
    }
  }
  next();
}

// Staff accounts have no Postgres `User` row — they're a separate identity
// space. Role + active state live in the `Staff` table (not a Firebase
// custom claim), checked fresh on every request, so a deactivation is
// enforced on the very next API call rather than waiting for the browser to
// refresh its ID token.
export async function requireStaff(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Login required");

  const decoded = await firebaseAuth.verifyIdToken(token).catch(() => {
    throw new ApiError(401, "Invalid or expired session");
  });

  const staff = await prisma.staff.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!staff || !staff.isActive) throw new ApiError(403, "Staff access required");

  req.staff = { id: staff.id, role: staff.role, email: staff.email, firebaseUid: staff.firebaseUid };
  next();
}

// Chain AFTER requireStaff — reads req.staff, does not re-verify the token.
export function requireRole(...roles: StaffRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.staff || !roles.includes(req.staff.role)) throw new ApiError(403, "Insufficient role");
    next();
  };
}

export const requireAdminOrAbove = requireRole("super_admin", "admin");
export const requireSuperAdmin = requireRole("super_admin");
