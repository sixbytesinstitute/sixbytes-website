import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME, type TokenPayload } from "./auth";

// ─── Types ──────────────────────────────────────────────
export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

type RouteHandler = (
  req: NextRequest,
  context: { user: TokenPayload; params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

// ─── Auth Wrapper ───────────────────────────────────────

/**
 * Wraps an API route handler with JWT cookie authentication.
 *
 * @param handler - The route handler function
 * @param allowedRoles - Optional array of roles that can access this route.
 *                       If omitted, any authenticated user can access.
 *
 * @example
 * // Any authenticated user
 * export const GET = withAuth(async (req, { user }) => { ... });
 *
 * // Admin only
 * export const POST = withAuth(async (req, { user }) => { ... }, ["admin"]);
 *
 * // Admin or faculty
 * export const GET = withAuth(async (req, { user }) => { ... }, ["admin", "faculty"]);
 */
export function withAuth(handler: RouteHandler, allowedRoles?: string[]) {
  return async (req: NextRequest, routeContext?: { params?: Promise<Record<string, string>> }) => {
    try {
      // Read the session cookie
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get(COOKIE_NAME);

      if (!sessionCookie?.value) {
        return NextResponse.json(
          { success: false, error: "Authentication required. Please log in." },
          { status: 401 }
        );
      }

      // Verify the JWT
      const user = verifyToken(sessionCookie.value);

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Session expired or invalid. Please log in again." },
          { status: 401 }
        );
      }

      // Check role authorization
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        return NextResponse.json(
          { success: false, error: "You do not have permission to access this resource." },
          { status: 403 }
        );
      }

      // Resolve route params if they exist
      const params = routeContext?.params ? await routeContext.params : undefined;

      // Call the handler with the authenticated user
      return handler(req, { user, params });
    } catch (error) {
      console.error("AUTH MIDDLEWARE ERROR:", error);
      return NextResponse.json(
        { success: false, error: "An authentication error occurred." },
        { status: 500 }
      );
    }
  };
}
