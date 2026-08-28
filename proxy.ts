import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

// ─── Role-based route protection ────────────────────────
// Next.js 16 uses proxy.ts instead of middleware.ts
// The exported function must be named `proxy`

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read the session cookie
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const token = sessionCookie?.value;

  // Decode the token (edge-compatible JWT verify)
  let user: { userId: string; role: string; email: string; class?: string } | null = null;
  if (token) {
    user = verifyToken(token);
  }

  // ── Public routes: always allow ───────────────────────
  // Home, about, courses, results, contact, resources (public SEO), API auth routes, static assets
  const publicPaths = [
    "/",
    "/about",
    "/courses",
    "/results",
    "/contact",
    "/resources",
    "/api/auth/login",
    "/api/auth/logout",
    "/api/resources",
  ];

  const isPublicPath = publicPaths.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/resources") ||
    pathname.includes(".");

  if (isPublicPath || isStaticAsset) {
    return NextResponse.next();
  }

  // ── Login page: redirect authenticated users to their dashboard ──
  if (pathname === "/login") {
    if (user) {
      const dashboardUrl = getDashboardUrl(user.role);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes: require authentication ─────────
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Force password change ────────────────────────────
  // If mustChangePassword, only allow /settings and /api/auth/change-password
  // (We can't check mustChangePassword from JWT alone — it's checked on frontend after /api/auth/me)

  // ── Role-based access control ────────────────────────
  if (pathname.startsWith("/admin")) {
    if (user.role !== "admin") {
      return NextResponse.redirect(
        new URL(getDashboardUrl(user.role), request.url)
      );
    }
  }

  if (pathname.startsWith("/faculty")) {
    if (user.role !== "faculty") {
      return NextResponse.redirect(
        new URL(getDashboardUrl(user.role), request.url)
      );
    }
  }

  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (user.role !== "student") {
      return NextResponse.redirect(
        new URL(getDashboardUrl(user.role), request.url)
      );
    }
  }

  return NextResponse.next();
}

// ─── Helper ─────────────────────────────────────────────
function getDashboardUrl(role: string): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "faculty":
      return "/faculty/dashboard";
    case "student":
    default:
      return "/dashboard";
  }
}

// ─── Matcher Config ─────────────────────────────────────
// Run proxy on all routes except static files and images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.jpg$|.*\\.png$|.*\\.svg$|.*\\.webp$).*)",
  ],
};
