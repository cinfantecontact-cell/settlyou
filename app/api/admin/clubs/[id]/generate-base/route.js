import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateBaseData } from "@/lib/ai/generate-document";

export const maxDuration = 300;

export async function POST(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  // Verify settl_admin
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

  // Fetch club
  const { data: club, error: fetchError } = await admin
    .from("clubs")
    .select("id, name, slug, type, city, country, address, division, custom_notes")
    .eq("id", id)
    .single();

  if (fetchError || !club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  if (!club.city) {
    return NextResponse.json({ error: "Club has no city set — add a city first" }, { status: 400 });
  }

  // Upsert city_base_data row as generating
  await admin
    .from("city_base_data")
    .upsert(
      {
        club_id: id,
        club_type: club.type,
        status: "generating",
        content: {},
        language: "en",
      },
      { onConflict: "club_id,language" }
    );

  // Generate in background
  after(async () => {
    console.log(`[generate-base] starting for ${club.name}...`);
    try {
      const content = await generateBaseData(club);

      await admin
        .from("city_base_data")
        .update({
          content,
          status: "ready",
          generated_at: new Date().toISOString(),
          version: 1,
        })
        .eq("club_id", id)
        .eq("language", "en");

      console.log(`[generate-base] done for ${club.name}`);
    } catch (err) {
      console.error(`[generate-base] failed for ${club.name}:`, err.message);
      await admin
        .from("city_base_data")
        .update({ status: "failed" })
        .eq("club_id", id)
        .eq("language", "en");
    }
  });

  return NextResponse.json({ ok: true, generating: true });
}
