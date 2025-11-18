import { NextRequest } from "next/server";
import { updatePassword } from "@/lib/helpers/auth";
import { getUserById } from "@/lib/helpers/user"
import { verifyToken } from "@/lib/helpers/jwt"
import { isValidPassword } from "@/lib/helpers/validation";
import { success, error } from "@/lib/auth/apiResponses";

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { token, newPassword } = await req.json();

    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) return error("User not found", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    // const passwordError = isValidPassword(newPassword);
    if (!isValidPassword(newPassword)) return error("Incorrect password", 400);

    await updatePassword(userId, newPassword);

    isDev && console.log("[Reset-Password API] Password reset successful for:", user.email);
    return success("Password reset successfully", 200);
  } catch (err: any) {
    isDev && console.error("[Reset-Password API] Error:", err.message || err);
    return error(err.message || "Invalid or expired token", 401);
  }
}
