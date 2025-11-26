import { NextRequest } from "next/server";
import { 
  verifyPassword, 
  updatePassword, 
  getAuthenticatedUser, 
  destroySession 
} from "@/lib/helpers/backend"
import { validatePassword } from "@/lib/helpers/shared";
import { success, error } from "@/lib/auth/apiResponses";

export async function POST(req: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";
  
  try {
    const { currentPassword, newPassword } = await req.json();

    // Authenticate user (manual + OAuth)
    const user = await getAuthenticatedUser(req);
    if (!user) return error("Unauthorized", 401);

    // Disallow OAuth users from changing password
    if (!user.password)
      return error("Password change not allowed for OAuth users", 403);

    const isMatch = await verifyPassword(currentPassword, user.password);
    if (!isMatch) return error("Incorrect current password", 400);

    const passwordError = validatePassword(newPassword);
    if (passwordError) return error("Invalid new password", 400);

    await updatePassword(user._id.toString(), newPassword);

    isDev && console.log("[Change-Password API] Password updated for:", user.email);
    const res = await success("Password updated successfully. Please login again.", 200);
    destroySession(res);

    return res;

  } catch (err: any) {
    isDev && console.error("[Change-Password API] Failed:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
