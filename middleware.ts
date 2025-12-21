import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { NODE_ENV, NEXTAUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = NODE_ENV === "development";

  // --- FETCH NEXTAUTH SESSION TOKEN ---
  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET! });

  isDev &&
    console.log(
      "[Middleware] Path:", pathname,
      "| NextAuthJWT token exists:", !!nextAuthToken
    );

  // =============================================================================
  //  ROLE-BASED GUARD
  //  Prevents users from accessing other roles' areas
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
    if (nextAuthToken) {
      isDev && console.log("[Middleware] Already signed in → redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // =============================================================================
  //  PROTECTED PAGES & API ROUTES
  // =============================================================================
  const isProtectedApi = pathname.startsWith("/api/auth/");
  const requiresAuth = pathname.startsWith("/founder") || pathname.startsWith("/investor") || isProtectedApi;

  if (requiresAuth) {
    if (!nextAuthToken) {
      if (isProtectedApi) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      } else {
        isDev && console.warn("[Middleware] Unauthorized access to protected page");
        return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
      }
    }

    // Authenticated → allow access
    return NextResponse.next();
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
    "/api/auth/change-password",
  ],
  runtime: "nodejs",
};
