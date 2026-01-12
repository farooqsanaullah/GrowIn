import Stripe from "stripe";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

  try {
    const { amount } = await req.json(); // e.g., 5000 for $50.00

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Test Product",
            },
            unit_amount: amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL!}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });

    console.log("🚀 ~ POST ~ session.id:", session.id)

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Stripe session creation failed." }, { status: 500 });
  }
}
