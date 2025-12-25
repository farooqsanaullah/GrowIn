import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { NODE_ENV, NEXTAUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = NODE_ENV === "development";

  // --- FETCH NEXTAUTH SESSION TOKEN ---
  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET! });

  // Determine if the request is for an API route
  const isApiRoute = pathname.startsWith("/api/");

  // =============================================================================
  //  ROLE-BASED GUARD FOR PAGES ONLY (skip APIs)
  // =============================================================================
  if (nextAuthToken?.role && !isApiRoute) {
    const userRole = nextAuthToken.role; // "investor" | "founder" | "admin"

    isDev &&
      console.log(
        "[Middleware] Path: ", pathname,
        "| Role: ", userRole,
        "| NextAuthJWT token exists: ", !!nextAuthToken,
      );

    const isAdminArea = pathname.startsWith("/admin");
    const isFounderArea = pathname.startsWith("/founder");
    const isInvestorArea = pathname.startsWith("/investor");

    switch (userRole) {
      case "admin":
        if (!isAdminArea) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
        break;

      case "founder":
        if (!isFounderArea) {
          return NextResponse.redirect(new URL("/founder/dashboard", req.url));
        }
        break;

      case "investor":
        if (!isInvestorArea) {
          return NextResponse.redirect(new URL("/investor/dashboard", req.url));
        }
        break;

      default:
        return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
    }
  }

  // =============================================================================
  //  PUBLIC AUTH ROUTES
  // =============================================================================
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    if (nextAuthToken) {
      isDev && console.log("[Middleware] Already signed in → redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // =============================================================================
  //  PROTECTED PAGES & API ROUTES
  // =============================================================================
  const isAuthApi = pathname.startsWith("/api/auth/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const requiresAuth =
    pathname.startsWith("/founder") ||
    pathname.startsWith("/investor") ||
    pathname.startsWith("/admin") ||
    isAuthApi ||
    isAdminApi;

  if (requiresAuth) {
    if (!nextAuthToken) {
      if (isAuthApi || isAdminApi) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        isDev && console.warn("[Middleware] Unauthorized access to protected page");
        return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
      }
    }

    // Role-based API protection
    if (isAdminApi && nextAuthToken.role !== "admin") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.next();
  }

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
    "/api/admin/:path*",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/change-password",
  ],
  runtime: "nodejs",
};
