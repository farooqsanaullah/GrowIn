import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/helpers/backend";
import { getToken } from "next-auth/jwt";

const { NODE_ENV, NEXTAUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = NODE_ENV === "development";

  // --- FETCH AUTH TOKENS ---
  // Manual token (from cookies) + NextAuth session token
  const manualToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET! });

  isDev &&
    console.log(
      "[Middleware] Path:", pathname,
      "ManualJWT:", !!manualToken,
      "NextAuthJWT:", !!nextAuthToken
    );

  // =============================================================================
  //  ROLE-BASED GUARD
  //  Prevents users from accessing other roles' areas
  //  - investor → /founder/*
  //  - founder → /investor/*
  // =============================================================================
  if (nextAuthToken?.role) {
    const userRole = nextAuthToken.role; // "investor" | "founder"
    const isTryingFounderArea = pathname.startsWith("/founder");
    const isTryingInvestorArea = pathname.startsWith("/investor");

    if (userRole === "investor" && isTryingFounderArea) {
      return NextResponse.redirect(
        new URL("/investor/dashboard?error=forbidden", req.url)
      );
    }

    if (userRole === "founder" && isTryingInvestorArea) {
      return NextResponse.redirect(
        new URL("/founder/dashboard?error=forbidden", req.url)
      );
    }
  }

  // =============================================================================
  //  PUBLIC AUTH ROUTES
  //  If already authenticated → redirect to dashboard
  // =============================================================================
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    if (manualToken || nextAuthToken) {
      try {
        manualToken && verifyToken(manualToken);
        isDev && console.log("[Middleware] Already signed in → redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Invalid token → allow access to signin/signup
      }
    }
    return NextResponse.next();
  }

  // =============================================================================
  //  PROTECTED PAGES & API ROUTES
  //  All /founder, /investor, and /api/auth/* routes
  // =============================================================================
  const isProtectedApi = pathname.startsWith("/api/auth/");
  const requiresAuth = pathname.startsWith("/founder") || pathname.startsWith("/investor") || isProtectedApi;

  if (requiresAuth) {
    if (!manualToken && !nextAuthToken) {
      if (isProtectedApi) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        isDev && console.warn("[Middleware] Unauthorized access to protected page");
        return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
      }
    }

    try {
      manualToken && verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      if (isProtectedApi) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
      } else {
        isDev && console.error("[Middleware] Invalid or expired manual token");
        return NextResponse.redirect(new URL("/signin?error=token_expired", req.url));
      }
    }
  }

  // Allow all other public routes
  return NextResponse.next();
}

// =============================================================================
//  MIDDLEWARE MATCHER
//  Runs middleware only for relevant routes
// =============================================================================
export const config = {
  matcher: [
    "/founder/:path*",
    "/investor/:path*",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
    "/api/auth/change-password",
  ],
  runtime: "nodejs",
};
