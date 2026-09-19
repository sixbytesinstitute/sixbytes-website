import jwt from "jsonwebtoken";

// ─── Types ──────────────────────────────────────────────
export interface TokenPayload {
  userId: string;
  role: "admin" | "manager" | "faculty" | "student";
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
  return process.env.JWT_SECRET || "k9X2mP7vQ4wR8nL1jF6hT3bY5cA0dE9gI2uO4sW7zM1xN6qJ3pV8rK5tH0yB4fD";
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
