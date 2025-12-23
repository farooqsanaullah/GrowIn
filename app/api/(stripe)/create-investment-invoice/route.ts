import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/db/connect";
import Startup from "@/lib/models/startup.model";
import { getUserById } from "@/lib/helpers/backend";
import Investment from "@/lib/models/investment.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { investorId, startupId, amount } = await req.json();

    if (!investorId || !startupId || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    await connectDB();

    const startup = await Startup.findById(startupId);
    if (!startup) return NextResponse.json({ error: "Startup not found" }, { status: 404 });

    const investor = await getUserById(investorId);
    if (!investor) return NextResponse.json({ error: "Investor not found" }, { status: 404 });

    // Create a pending investment in DB
    const investment = await Investment.create({
      investorId,
      startupId,
      amount: amountNum,
      status: "pending",
      stripeInvoiceId: null,
    });

    // Create Stripe customer
    const customer = await stripe.customers.create({ email: investor.email });

    // 1. Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: false, // we will finalize manually after items added
    });

    // 2. Add invoice item linked to the invoice
    await stripe.invoiceItems.create({
      customer: customer.id,
      invoice: invoice.id,
      amount: Math.round(amountNum * 100), // in cents
      currency: "usd",
      description: `Investment in startup ${startup.title}`,
    });

    console.log("🚀 Investment amount:", amountNum);

    // 3. Finalize invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    console.log("🚀 Final invoice amount_due:", finalizedInvoice.amount_due);

    // Update investment with Stripe info
    investment.stripeCustomerId = customer.id;
    investment.stripeInvoiceId = invoice.id;
    await investment.save();

    return NextResponse.json({
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      investorEmail: investor.email,
      startupId: startup._id.toString(),
    });
  } catch (err: any) {
    console.error("Error creating investment invoice:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
