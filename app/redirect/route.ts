import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextAuthOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  // Not logged in → send back to signin
  if (!session) return NextResponse.redirect(new URL("/signin", req.url));

  const role = session.user.role;

  if (role === "investor")
    return NextResponse.redirect(new URL("/investor/dashboard", req.url));

  if (role === "founder")
    return NextResponse.redirect(new URL("/founder/dashboard", req.url));

  // fallback
  return NextResponse.redirect(new URL("/explore", req.url));
}
