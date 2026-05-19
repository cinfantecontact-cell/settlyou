import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "admissions"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: config } = await admin
    .from("admissions_doc_config")
    .select("active_base_docs, custom_docs")
    .eq("club_id", profile.club_id)
    .single();

  return NextResponse.json({ config: config ?? null });
}

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (!["club_admin", "admissions"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { active_base_docs, custom_docs, doc_settings, form_questions, attachments } = await request.json();

  const upsertData = {
    club_id: profile.club_id,
    active_base_docs: active_base_docs ?? [],
    custom_docs: custom_docs ?? [],
    doc_settings: doc_settings ?? {},
    updated_at: new Date().toISOString(),
  };
  if (form_questions !== undefined) upsertData.form_questions = form_questions;
  if (attachments !== undefined) upsertData.attachments = attachments;

  const { error } = await admin
    .from("admissions_doc_config")
    .upsert(upsertData, { onConflict: "club_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
