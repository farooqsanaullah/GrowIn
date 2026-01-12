import Stripe from "stripe";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import { sendInvestmentEmails } from "@/lib/helpers";
import { IUser } from "@/lib/models/user.model";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});
  await connectDB();

  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!sig) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const invoice = event.data.object as Stripe.Invoice;

  switch (event.type) {
    case "invoice.created": {
      await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        { status: "pending" }
      );
      break;
    }

    case "invoice.paid": {
      // Mark investment as paid (idempotent)
      const investment = await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id, status: { $ne: "paid" } }, // idempotent
        { status: "paid", paidAt: new Date() },
        { new: true }
      ).populate("investorId");

      if (!investment) break;

      // getting totalRaised
      const [{ totalRaised = 0 } = {}] = await Investment.aggregate([
        { $match: { startupId: investment.startupId, status: "paid" } },
        { $group: { _id: null, totalRaised: { $sum: "$amount" } } },
      ]);
      
      // Update startup totalRaised and investors list
      await Startup.findByIdAndUpdate(investment.startupId._id, {
        totalRaised,
        $addToSet: { investors: investment.investorId },
      });

      const startup = await Startup.findById(investment.startupId).populate("founders");
      const investor = investment.investorId;
      const founders = startup.founders as IUser[];

      await sendInvestmentEmails({
        founders: startup.founders.map((f: IUser) => ({
          name: f.name ?? f.userName ?? "Unknown Founder",
          email: f.email,
        })),
        investor: {
          name: investor.name ?? investor.userName ?? "Unknown Investor",
          email: investor.email,
        },
        startup: {
          title: startup.title,
        },
        amount: investment.amount,
      });

      break;
    }

    case "invoice.payment_failed": {
      await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        { status: "failed", failedAt: new Date() }
      );
      break;
    }

    case "invoice.voided":
    case "invoice.marked_uncollectible": {
      await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        { status: "cancelled", cancelledAt: new Date() }
      );
      break;
    }

    // case "invoice.refunded": {
    //   await Investment.findOneAndUpdate(
    //     { stripeInvoiceId: invoice.id },
    //     { status: "refunded", refundedAt: new Date() }
    //   );
    //   break;
    // }
  }

  return new Response("Webhook processed", { status: 200 });
}
