import { NextRequest } from "next/server";
import { verifyToken, getUserById, updatePassword } from "@/lib/helpers/backend";
import { validatePassword } from "@/lib/helpers/shared";
import { success, error } from "@/lib/auth/apiResponses";
import { connectDB } from "@/lib/db/connect";

export async function POST(req: NextRequest) {
  await connectDB();
  
  const isDev = process.env.NODE_ENV === "development";

  try {
    const { token, newPassword } = await req.json();

    const { userId } = verifyToken(token);
    const user = await getUserById(userId);
    if (!user) return error("User not found", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    const passwordError = validatePassword(newPassword);
    if (passwordError) return error("Invalid password", 400);

    await updatePassword(userId, newPassword);

    isDev && console.log("[Reset-Password API] Password reset successful for:", user.email);
    return success("Password reset successfully", 200);
  } catch (err: any) {
    isDev && console.error("[Reset-Password API] Error:", err.message || err);
    return error(err.message || "Invalid or expired token", 401);
  }
}
