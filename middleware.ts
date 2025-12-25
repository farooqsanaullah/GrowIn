import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { NODE_ENV, NEXTAUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = NODE_ENV === "development";

  isDev && console.log("[Middleware] Requested path:", pathname);

  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET! });
  isDev && console.log("[Middleware] NextAuthJWT token exists:", !!nextAuthToken);

  const isApiRoute = pathname.startsWith("/api/");
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isFounderApi = pathname.startsWith("/api/founder/");
  const isInvestorApi = pathname.startsWith("/api/investor/");

  // =============================================================================
  // PUBLIC AUTH ROUTES
  // =============================================================================
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    isDev && console.log("[Middleware] Public auth route accessed");
    if (nextAuthToken) {
      isDev && console.log("[Middleware] Already signed in → redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // =============================================================================
  // PROTECTED ROUTES (pages + APIs)
  // =============================================================================
  const protectedPaths =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/founder") ||
    pathname.startsWith("/investor") ||
    isAuthApi ||
    isFounderApi ||
    isInvestorApi ||
    isAdminApi;

  if (protectedPaths) {
    isDev && console.log("[Middleware] Protected route detected");

    // Not authenticated → block
    if (!nextAuthToken) {
      isDev && console.log("[Middleware] Unauthorized access attempt");
      if (isApiRoute) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
    }

    // Role-based protection
    const role = nextAuthToken.role;
    isDev && console.log("[Middleware] User role:", role);

    if (isApiRoute) {
      isDev && console.log("[Middleware] API route access");

      if (isAdminApi && role !== "admin") {
        isDev && console.log("[Middleware] Access denied to admin API");
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
      if (isFounderApi && role !== "founder") {
        isDev && console.log("[Middleware] Access denied to founder API");
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
      if (isInvestorApi && role !== "investor") {
        isDev && console.log("[Middleware] Access denied to investor API");
        return NextResponse.json({ message: "Access denied" }, { status: 403 });
      }
    } else {
      isDev && console.log("[Middleware] Page route access");

      const isAdminArea = pathname.startsWith("/admin");
      const isFounderArea = pathname.startsWith("/founder");
      const isInvestorArea = pathname.startsWith("/investor");

      switch (role) {
        case "admin":
          if (!isAdminArea) {
            isDev && console.log("[Middleware] Redirecting admin to /admin/dashboard");
            return NextResponse.redirect(new URL("/admin/dashboard", req.url));
          }
          break;
        case "founder":
          if (!isFounderArea) {
            isDev && console.log("[Middleware] Redirecting founder to /founder/dashboard");
            return NextResponse.redirect(new URL("/founder/dashboard", req.url));
          }
          break;
        case "investor":
          if (!isInvestorArea) {
            isDev && console.log("[Middleware] Redirecting investor to /investor/dashboard");
            return NextResponse.redirect(new URL("/investor/dashboard", req.url));
          }
          break;
        default:
          isDev && console.log("[Middleware] Unknown role → redirect to signin");
          return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
      }
    }
  }

  // =============================================================================
  // ALLOW PUBLIC ROUTES
  // =============================================================================
  isDev && console.log("[Middleware] Allowing public access");
  return NextResponse.next();
}

// =============================================================================
//  MIDDLEWARE MATCHER
// =============================================================================
export const config = {
  matcher: [
    "/founder/:path*",
    "/investor/:path*",
    "/admin/:path*",
    "/api/founder/:path*",
    "/api/investor/:path*",
    "/api/admin/:path*",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/change-password",
  ],
  runtime: "nodejs",
};
