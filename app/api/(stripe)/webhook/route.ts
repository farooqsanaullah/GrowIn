import Stripe from "stripe";
import { NextResponse } from "next/server";
import Investment from "@/lib/models/investment.model";
import { connectDB } from "@/lib/db/connect";

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
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook error", { status: 400 });
  }

  console.log("📬 Event type:", event.type);

  try {
    switch (event.type) {
      // ✅ SUCCESS - Payment completed successfully
      case "invoice.paid":
      case "payment_intent.succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("✅ Payment succeeded for invoice:", invoice.id);

        const updated = await Investment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          { 
            status: "success", 
            paidAt: new Date() 
          },
          { new: true }
        );

        if (!updated) {
          console.error("❌ Investment not found for invoice:", invoice.id);
        } else {
          console.log("✅ Investment marked as success:", updated._id);
        }
        break;
      }

      // ⏳ PENDING - Payment is processing
      case "invoice.created":
      case "payment_intent.created":
      case "payment_intent.processing": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("⏳ Payment pending for invoice:", invoice.id);

        const updated = await Investment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          { status: "pending" },
          { new: true }
        );

        if (updated) {
          console.log("⏳ Investment marked as pending:", updated._id);
        }
        break;
      }

      // ❌ FAILED - Payment failed
      case "invoice.payment_failed":
      case "payment_intent.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("❌ Payment failed for invoice:", invoice.id);

        const updated = await Investment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          { 
            status: "failed",
            failedAt: new Date()
          },
          { new: true }
        );

        if (!updated) {
          console.error("❌ Investment not found for failed invoice:", invoice.id);
        } else {
          console.log("❌ Investment marked as failed:", updated._id);
        }
        break;
      }

      // 🚫 CANCELLED - Payment was cancelled
      case "invoice.voided":
      case "payment_intent.canceled": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("🚫 Payment cancelled for invoice:", invoice.id);

        const updated = await Investment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          { 
            status: "cancelled",
            cancelledAt: new Date()
          },
          { new: true }
        );

        if (updated) {
          console.log("🚫 Investment marked as cancelled:", updated._id);
        }
        break;
      }

      // ⏰ EXPIRED - Invoice expired without payment
      case "invoice.payment_action_required":
      case "invoice.marked_uncollectible": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("⏰ Payment expired for invoice:", invoice.id);

        const updated = await Investment.findOneAndUpdate(
          { stripeInvoiceId: invoice.id },
          { 
            status: "expired",
            expiredAt: new Date()
          },
          { new: true }
        );

        if (updated) {
          console.log("⏰ Investment marked as expired:", updated._id);
        }
        break;
      }

      // 💰 REFUNDED - Payment was refunded
      // case "charge.refunded":
      // case "invoice.refunded": {
      //   const object = event.data.object as Stripe.Charge | Stripe.Invoice;
      //   const invoiceId = "invoice" in object ? object.invoice : object.id;
      //   console.log("💰 Payment refunded for invoice:", invoiceId);

      //   const updated = await Investment.findOneAndUpdate(
      //     { stripeInvoiceId: invoiceId },
      //     { 
      //       status: "refunded",
      //       refundedAt: new Date()
      //     },
      //     { new: true }
      //   );

      //   if (updated) {
      //     console.log("💰 Investment marked as refunded:", updated._id);
      //   }
      //   break;
      // }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Error processing webhook event:", err);
    return new Response("Error processing webhook", { status: 500 });
  }

  return new Response("Webhook received", { status: 200 });
}