import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") || profile.sport;
  if (!sport) return NextResponse.json({ config: null });

  const { data: config } = await admin
    .from("sport_document_config")
    .select("disabled_base_docs, custom_docs, doc_settings, form_questions")
    .eq("club_id", profile.club_id)
    .eq("sport", sport)
    .single();

  return NextResponse.json({ config: config ?? null });
}

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { sport, disabled_base_docs, custom_docs, doc_settings, form_questions } = await request.json();
  const targetSport = sport || profile.sport;
  if (!targetSport) return NextResponse.json({ error: "Sport required" }, { status: 400 });

  const { error } = await admin
    .from("sport_document_config")
    .upsert(
      { club_id: profile.club_id, sport: targetSport, disabled_base_docs, custom_docs, doc_settings, form_questions, updated_at: new Date().toISOString() },
      { onConflict: "club_id,sport" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
