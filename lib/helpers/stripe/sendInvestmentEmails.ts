import { Resend } from "resend";
import {
  founderInvestmentReceivedEmail,
  investorInvestmentConfirmationEmail,
} from "@/lib/constants/email";


type SendInvestmentEmailsProps = {
  founders: {
    name: string;
    email: string;
  }[];
  investor: {
    name: string;
    email: string;
  };
  startup: {
    title: string;
  };
  amount: number;
  currency?: string;
};

export async function sendInvestmentEmails({
  founders,
  investor,
  startup,
  amount,
  currency = "USD",
}: SendInvestmentEmailsProps) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    /* ---------- Founder email ---------- */
    await Promise.all(
      founders.map(founder =>
        resend.emails.send({
          from: process.env.EMAIL_FROM!,
          // to: founder.email,
          to: 'muhammad.mateen@amroodlabs.com',
          ...founderInvestmentReceivedEmail({
            founderName: founder.name,
            investorName: investor.name,
            startupName: startup.title,
            amount,
            currency,
          }),
        })
      )
    );

    /* ---------- Investor email ---------- */
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: investor.email,
      ...investorInvestmentConfirmationEmail({
        investorName: investor.name,
        startupName: startup.title,
        amount,
        currency,
      }),
    });
    console.log("📧 Investment emails sent successfully");
  } catch (error) {
    console.error("❌ Failed to send investment emails:", error);
    // DO NOT throw → webhook must still return 200 to Stripe
  }
}
