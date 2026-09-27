import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { logger } from "@/config/logger";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!getApps().length) {
  if (!projectId || !clientEmail || !privateKey) {
    logger.warn("FIREBASE_* env vars not fully set — Firebase Auth verification will fail until configured.");
  }
  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export const firebaseAuth = getAuth();
