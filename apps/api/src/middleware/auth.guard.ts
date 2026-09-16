import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "@/modules/auth/auth.service";
import { ApiError } from "@/middleware/error-handler";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) throw new ApiError(401, "Login required");

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    throw new ApiError(401, "Invalid or expired session");
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      req.userId = verifyToken(token).sub;
    } catch {
      // ignore invalid token, request proceeds unauthenticated
    }
  }
  next();
}
