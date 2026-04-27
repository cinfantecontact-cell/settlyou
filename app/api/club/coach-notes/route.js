import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles")
    .select("role, club_id, sport")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "coach") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const fd = await request.formData();
  const custom_notes = fd.get("custom_notes") || null;
  let custom_links = [];
  try {
    custom_links = JSON.parse(fd.get("custom_links") || "[]");
  } catch {
    custom_links = [];
  }

  const { error } = await admin
    .from("coach_sport_notes")
    .upsert(
      { club_id: profile.club_id, sport: profile.sport, custom_notes, custom_links },
      { onConflict: "club_id,sport" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
