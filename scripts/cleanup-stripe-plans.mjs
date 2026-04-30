/**
 * cleanup-stripe-plans.mjs
 *
 * Archives old Stripe products/prices that are NOT tagged with settlyou_plan_id.
 * Run AFTER update-stripe-plans.mjs has created the correct new ones.
 *
 * Usage:
 *   node scripts/cleanup-stripe-plans.mjs
 */

import Stripe from "stripe";
import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length && !process.env[k.trim()]) {
      process.env[k.trim()] = rest.join("=").trim();
    }
  }
} catch {}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

async function run() {
  const products = await stripe.products.list({ active: true, limit: 100 });

  const old = products.data.filter((p) => !p.metadata?.settlyou_plan_id);

  if (old.length === 0) {
    console.log("✅  No old products to clean up.");
    return;
  }

  console.log(`\nFound ${old.length} product(s) without settlyou_plan_id — archiving:\n`);

  for (const product of old) {
    // Clear default_price so we can archive prices
    if (product.default_price) {
      await stripe.products.update(product.id, { default_price: "" });
    }

    // Archive all active prices on this product
    const prices = await stripe.prices.list({ product: product.id, active: true });
    for (const price of prices.data) {
      await stripe.prices.update(price.id, { active: false });
      console.log(`   Archived price: ${price.id} (${price.nickname ?? price.unit_amount / 100})`);
    }

    // Archive the product
    await stripe.products.update(product.id, { active: false });
    console.log(`   Archived product: ${product.id} — ${product.name}\n`);
  }

  console.log("✅  Done. Old products and prices are now archived in Stripe.");
}

run().catch((err) => {
  console.error("❌  Stripe error:", err.message);
  process.exit(1);
});
