import { NextRequest } from "next/server";
import { verifyToken, getUserById, updatePassword } from "@/lib/helpers/backend";
import { PasswordSchema } from "@/lib/auth/zodSchemas";
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

    // Zod validation for new password
    const result = PasswordSchema.safeParse(newPassword);
    if (!result.success) {
      return error(result.error.issues.map(e => e.message).join(", "), 400);
    }

    await updatePassword(userId, newPassword);

    isDev && console.log("[Reset-Password API] Password reset successful for:", user.email);
    return success("Password reset successfully", 200);
  } catch (err: any) {
    isDev && console.error("[Reset-Password API] Error:", err.message || err);
    return error(err.message || "Invalid or expired token", 401);
  }
}
