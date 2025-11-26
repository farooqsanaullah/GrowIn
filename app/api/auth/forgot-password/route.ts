import { NextRequest } from "next/server";
import { Resend } from "resend";
import { getUserByEmail, getSignedToken } from "@/lib/helpers/backend";
import { validateEmail } from "@/lib/helpers/shared" ;
import { success, error } from "@/lib/auth/apiResponses";
import { connectDB } from "@/lib/db/connect";

const {
  NODE_ENV,
  NEXTAUTH_URL,
  RESEND_API_KEY,
} = process.env;

const isDev = NODE_ENV! === "development";

// Lazy initialize Resend to avoid build errors when API key is missing
let resend: Resend | null = null;
function getResendClient() {
  if (!resend && RESEND_API_KEY) {
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
}

export async function POST(req: NextRequest) {
  await connectDB();

  try {
    const { email } = await req.json();

    const emailError = validateEmail(email);
    if (emailError) return error(emailError, 400);

    const user = await getUserByEmail(email);
    if (!user) return error("Email not found", 404);
    if (!user.password) return error("OAuth accounts cannot reset passwords manually", 403);

    const resetToken = getSignedToken({ userId: user._id.toString() });
    const resetUrl = `${NEXTAUTH_URL!}/reset-password?token=${resetToken}`;

    const resendClient = getResendClient();
    if (!resendClient) {
      return error("Email service is not configured", 500);
    }

    await resendClient.emails.send({
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
