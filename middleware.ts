import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/helpers/backend";
import { getToken } from "next-auth/jwt";

const { NODE_ENV, NEXTAUTH_SECRET } = process.env;

export const protectedRoutes = [
  "/Profile/:userName",
  "/founder/:username",
  "/investor/:username",
];

// Utility to convert route patterns to RegExp
function routeToRegex(route: string) {
  // Replace :param with [^/]+
  return new RegExp("^" + route.replace(/:\w+/g, "[^/]+") + "$");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDev = NODE_ENV === "development";

  // Fetch tokens
  const manualToken = req.cookies.get("token")?.value;
  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET! });

  // Log in dev mode
  if (isDev) {
    console.log("[Middleware] Path:", pathname, "ManualJWT:", !!manualToken, "NextAuthJWT:", !!nextAuthToken);
  }

  // --- PUBLIC ROUTES ---
  if (pathname.startsWith("/signin") || pathname.startsWith("/signup")) {
    if (manualToken || nextAuthToken) {
      try {
        if (manualToken) verifyToken(manualToken);
        if (isDev) console.log("[Middleware] Already signed in → redirecting to /dashboard");
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } catch {
        // Invalid token → allow access to signin/signup
      }
    }
    return NextResponse.next();
  }

  // --- PROTECTED PAGES ---
  const isProtectedPage = protectedRoutes.some((route) => routeToRegex(route).test(pathname));

  if (isProtectedPage) {
    if (!manualToken && !nextAuthToken) {
      if (isDev) console.warn("[Middleware] Unauthorized access to protected page");
      return NextResponse.redirect(new URL("/signin?error=unauthorized", req.url));
    }
    try {
      if (manualToken) verifyToken(manualToken);
      return NextResponse.next();
    } catch {
      if (isDev) console.error("[Middleware] Invalid or expired token");
      return NextResponse.redirect(new URL("/signin?error=token_expired", req.url));
    }
  }

  // --- PROTECTED API ROUTES ---
  // Example template: uncomment and add your private APIs
  // if (pathname.startsWith("/api/private/")) {
  //   if (!manualToken && !nextAuthToken) {
  //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  //   }
  //   try {
  //     if (manualToken) verifyToken(manualToken);
  //     return NextResponse.next();
  //   } catch {
  //     return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  //   }
  // }

  // Default fallback (public pages)
  return NextResponse.next();
}

// --- Middleware Matcher ---
export const config = {
  matcher: [
    "/Profile/:userName",
    "/founder/:username",
    "/investor/:username",
    // API protection
    // "/api/private/:path*",
  ],
};
