import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const PLAN_MAP = {
  "Micro Plan":   { tier: "micro",   guide_limit: 40 },
  "Starter Plan": { tier: "starter", guide_limit: 100 },
  "Pro Plan":     { tier: "pro",     guide_limit: 200 },
};

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  // Verify webhook signature if secret is configured
  if (STRIPE_WEBHOOK_SECRET) {
    try {
      const { createHmac } = await import("crypto");
      const [, ts] = sig.match(/t=(\d+)/) || [];
      const [, v1] = sig.match(/v1=([a-f0-9]+)/) || [];
      const expected = createHmac("sha256", STRIPE_WEBHOOK_SECRET)
        .update(`${ts}.${body}`)
        .digest("hex");
      if (expected !== v1) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "Signature check failed" }, { status: 400 });
    }
  }

  const event = JSON.parse(body);
  const admin = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name;
    const amountPaid = session.amount_total / 100; // cents → dollars

    // Get line items to determine plan
    const lineItems = session.display_items || [];
    const productName = lineItems[0]?.custom?.name || lineItems[0]?.price?.product?.name || "";
    const plan = PLAN_MAP[productName] || { tier: "unknown", guide_limit: null };

    // Log to billing table
    await admin.from("billing").insert({
      source: "stripe",
      description: `${productName} — ${customerName || customerEmail}`,
      amount: amountPaid,
      type: "revenue",
      status: "paid",
      billing_date: new Date().toISOString().split("T")[0],
      stripe_session_id: session.id,
      customer_email: customerEmail,
      customer_name: customerName,
      tier: plan.tier,
      guide_limit: plan.guide_limit,
    });
  }

  return NextResponse.json({ received: true });
}
