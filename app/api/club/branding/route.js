import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: club } = await admin.from("clubs").select("plan, slug").eq("id", profile.club_id).single();
  if (club?.plan !== "premium") return NextResponse.json({ error: "Premium only" }, { status: 403 });

  const formData = await request.formData();
  const primary_color = formData.get("primary_color");
  const secondary_color = formData.get("secondary_color");
  const custom_notes = formData.get("custom_notes") || null;
  const logoFile = formData.get("logo");

  const updates = { primary_color, secondary_color, custom_notes };

  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop();
    const path = `${club.slug}.${ext}`;
    const buffer = new Uint8Array(await logoFile.arrayBuffer());
    const { error: uploadError } = await admin.storage.from("club-logos").upload(path, buffer, { contentType: logoFile.type, upsert: true });
    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage.from("club-logos").getPublicUrl(path);
      updates.logo_url = publicUrl;
    }
  }

  const { error } = await admin.from("clubs").update(updates).eq("id", profile.club_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
