import Stripe from "stripe";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  console.log("🚀 ~ POST ~ webhook hitted!");

  await connectDB();

  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return new Response("Webhook error", { status: 400 });
  }

  console.log("📬 Event type:", event.type);

  try {
    const obj: any = event.data.object;

    // Determine invoiceId if it exists
    const invoiceId =
      obj.object === "invoice" ? obj.id :
      obj.invoice ? obj.invoice : undefined;

    if (!invoiceId) {
      console.log("⚠️ Event has no invoiceId, ignoring:", event.type);
      return new Response("Ignored", { status: 200 });
    }

    // Define update mapping
    const statusMap: Record<string, Partial<any>> = {
      "invoice.paid": { status: "paid", paidAt: new Date() },
      "payment_intent.succeeded": { status: "paid", paidAt: new Date() },
      "invoice.created": { status: "pending" },
      "payment_intent.created": { status: "pending" },
      "payment_intent.processing": { status: "pending" },
      "invoice.payment_failed": { status: "failed", failedAt: new Date() },
      "payment_intent.payment_failed": { status: "failed", failedAt: new Date() },
      "invoice.voided": { status: "cancelled", cancelledAt: new Date() },
      "payment_intent.canceled": { status: "cancelled", cancelledAt: new Date() },
      "invoice.payment_action_required": { status: "expired", expiredAt: new Date() },
      "invoice.marked_uncollectible": { status: "expired", expiredAt: new Date() },
      "charge.refunded": { status: "refunded", refundedAt: new Date() },
      "invoice.refunded": { status: "refunded", refundedAt: new Date() },
    };

    const updateData = statusMap[event.type];

    if (updateData) {
      const updatedInvestment = await Investment.findOneAndUpdate(
        { stripeInvoiceId: invoiceId },
        updateData,
        { new: true }
      );

      if (updatedInvestment && updateData.status === "paid") {
        console.log("✅ Investment paid, updating startup totalRaised and investors list");

        // 1. Calculate totalRaised for this startup
        const investmentTotal = await Investment.aggregate([
          { $match: { startupId: updatedInvestment.startupId, status: "paid" } },
          { $group: { _id: null, totalRaised: { $sum: "$amount" } } },
        ]);

        const totalRaised =
          investmentTotal.length > 0 ? investmentTotal[0].totalRaised : 0;

        // 2. Update startup: totalRaised + add investor to investors array if not already there
        await Startup.findByIdAndUpdate(updatedInvestment.startupId, {
          totalRaised,
          $addToSet: { investors: updatedInvestment.investorId }, // ensures no duplicates
        });

        console.log(`✅ Startup updated: totalRaised=${totalRaised}`);
      }

      if (!updatedInvestment) {
        console.error("❌ Investment not found for invoice:", invoiceId);
      } else {
        console.log(`✅ Investment status updated to '${updateData.status}' for:`, updatedInvestment._id);
      }
    } else {
      console.log("ℹ️ Unhandled event type:", event.type);
    }

  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return new Response("Error processing webhook", { status: 500 });
  }

  return new Response("Webhook processed", { status: 200 });
}
