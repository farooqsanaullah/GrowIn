import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendInvestorEmail({
  to,
  amount,
  startupName,
}: {
  to: string;
  amount: number;
  startupName: string;
}) {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: "Your Investment Was Successful",
    html: `
      <h2>Investment Successful 🎉</h2>
      <p>You have successfully invested <strong>$${amount}</strong> in <strong>${startupName}</strong>.</p>
      <p>We appreciate your support!</p>
    `,
  });
}

export async function sendFounderEmail({
  to,
  amount,
  investorName,
}: {
  to: string;
  amount: number;
  investorName: string;
}) {
  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to,
    subject: "You Received a New Investment",
    html: `
      <h2>You Received an Investment 🎉</h2>
      <p><strong>${investorName}</strong> has invested <strong>$${amount}</strong> in your startup.</p>
      <p>Keep up the amazing work!</p>
    `,
  });
}
