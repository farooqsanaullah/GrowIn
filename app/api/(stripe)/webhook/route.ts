import Stripe from "stripe";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
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
      const investment = await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id, status: { $ne: "paid" } }, // idempotent
        { status: "paid", paidAt: new Date() },
        { new: true }
      );

      if (!investment) break;

      const [{ totalRaised = 0 } = {}] = await Investment.aggregate([
        { $match: { startupId: investment.startupId, status: "paid" } },
        { $group: { _id: null, totalRaised: { $sum: "$amount" } } },
      ]);

      await Startup.findByIdAndUpdate(investment.startupId, {
        totalRaised,
        $addToSet: { investors: investment.investorId },
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
