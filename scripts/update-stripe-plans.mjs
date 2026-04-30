/**
 * update-stripe-plans.mjs
 *
 * Creates (or updates) Stripe products and annual prices for Settlyou plans.
 *
 * Usage:
 *   node scripts/update-stripe-plans.mjs
 *
 * Set STRIPE_SECRET_KEY in .env.local before running.
 * Run once. Safe to re-run — it looks up existing products by metadata
 * before creating new ones.
 */

import Stripe from "stripe";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually (no dotenv dependency needed)
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

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error("❌  Set STRIPE_SECRET_KEY before running this script.");
  process.exit(1);
}

const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

const PLANS = [
  {
    id: "starter",
    name: "Settlyou Starter",
    description: "Up to 15 athletes",
    amount: 490000, // $4,900 in cents
  },
  {
    id: "department",
    name: "Settlyou Department",
    description: "Up to 50 athletes",
    amount: 1990000, // $19,900 in cents
  },
  {
    id: "enterprise",
    name: "Settlyou Enterprise",
    description: "Up to 100 athletes",
    amount: 3990000, // $39,900 in cents
  },
];

async function findExistingProduct(planId) {
  const products = await stripe.products.search({
    query: `metadata["settlyou_plan_id"]:"${planId}"`,
  });
  return products.data[0] ?? null;
}

async function run() {
  console.log(`\n🔑  Using key: ${key.slice(0, 14)}...\n`);

  for (const plan of PLANS) {
    console.log(`── ${plan.name}`);

    // 1. Find or create product
    let product = await findExistingProduct(plan.id);

    if (product) {
      console.log(`   Product found: ${product.id}`);
      // Update name/description in case they changed
      product = await stripe.products.update(product.id, {
        name: plan.name,
        description: plan.description,
      });
    } else {
      product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: { settlyou_plan_id: plan.id },
      });
      console.log(`   Product created: ${product.id}`);
    }

    // 2. Check if an active annual price at this amount already exists
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      type: "recurring",
    });

    const existingPrice = prices.data.find(
      (p) =>
        p.unit_amount === plan.amount &&
        p.currency === "usd" &&
        p.recurring?.interval === "year"
    );

    if (existingPrice) {
      console.log(`   Price already up to date: ${existingPrice.id}  ($${plan.amount / 100}/yr)\n`);
      continue;
    }

    // 3. Archive old prices
    for (const old of prices.data) {
      await stripe.prices.update(old.id, { active: false });
      console.log(`   Archived old price: ${old.id}`);
    }

    // 4. Create new price
    const newPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: plan.amount,
      currency: "usd",
      recurring: { interval: "year" },
      nickname: `${plan.name} Annual`,
      metadata: { settlyou_plan_id: plan.id },
    });

    console.log(`   New price created: ${newPrice.id}  ($${plan.amount / 100}/yr)\n`);
  }

  console.log("✅  Done. Copy the price IDs above into your environment variables if needed.\n");
}

run().catch((err) => {
  console.error("❌  Stripe error:", err.message);
  process.exit(1);
});
