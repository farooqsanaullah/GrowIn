import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log("🚀 ~ POST ~ body:", body)
    const { message, currentStatus, requestedStatus } = body;

    if (!message || !requestedStatus) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.ADMIN_EMAIL!,
      subject: "User Status Change Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6">
          <h2>Status Change Request</h2>

          <p><strong>User Email:</strong> ${session.user.email}</p>
          <p><strong>Current Status:</strong> ${currentStatus}</p>
          <p><strong>Requested Status:</strong> ${requestedStatus}</p>

          <hr />

          <p><strong>Message from user:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Request sent successfully",
    });
  } catch (error) {
    console.error("Status request error:", error);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
