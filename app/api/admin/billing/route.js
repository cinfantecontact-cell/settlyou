import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { club_id, club_name, plan, amount_usd, status, billing_date, notes, record_type, category } = body;

  if (!club_name || !amount_usd || !billing_date) {
    return NextResponse.json({ error: "club_name, amount_usd and billing_date are required" }, { status: 400 });
  }

  const { error } = await admin.from("billing").insert({
    club_id: club_id || null,
    club_name,
    plan: plan || null,
    amount_usd: parseFloat(amount_usd),
    status: status || "paid",
    billing_date,
    notes: notes || null,
    record_type: record_type || "revenue",
    category: category || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "settl_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await admin.from("billing").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
