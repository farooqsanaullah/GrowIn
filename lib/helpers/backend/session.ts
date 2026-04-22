import { NextResponse } from "next/server";

export function destroySession(res: NextResponse): void {
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
}