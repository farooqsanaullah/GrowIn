import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getUserByEmail } from "@/lib/helpers/user";
import { getSignedToken } from "@/lib/helpers/jwt"
import { isValidEmail } from "@/lib/helpers/validation";
import { success, error } from "@/lib/auth/apiResponses";
import { connectDB } from "@/lib/db/connect";

const {
  NODE_ENV,
  NEXTAUTH_URL,
  RESEND_API_KEY,
} = process.env;

const resend = new Resend(RESEND_API_KEY!);
const isDev = NODE_ENV! === "development";

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { email } = await req.json();

    // const emailError = isValidEmail(email);
    if (!isValidEmail(email)) return error("Invalid email", 422);

    const user = await getUserByEmail(email);
    if (!user) return error("Email not registered", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    const resetToken = getSignedToken({ userId: user._id.toString() });
    const resetUrl = `${NEXTAUTH_URL!}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click here to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    });
    isDev && console.log("[Forgot-Password API] Reset link sent to:", email);
    return success(`A reset link has been sent to: ${email}`, 200);
  } catch (err: any) {
    isDev && console.error("[Forgot-Password API] Error:", err.message || err);
    return error(err.message || "Server error", 500);
  }
}
