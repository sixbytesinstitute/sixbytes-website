import jwt from "jsonwebtoken";

// ─── Types ──────────────────────────────────────────────
export interface TokenPayload {
  userId: string;
  role: "admin" | "faculty" | "student";
  email: string;
  class?: string;
}

// ─── Cookie Configuration ───────────────────────────────
export const COOKIE_NAME = "sb_session";

export const COOKIE_CONFIG = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

// ─── JWT Helpers ────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
}

/**
 * Sign a JWT token with user payload.
 * Expires in 7 days.
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload, or null if invalid/expired.
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, getSecret()) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}
