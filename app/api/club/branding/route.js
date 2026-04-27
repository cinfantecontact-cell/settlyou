import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles").select("role, club_id").eq("id", user.id).single();
    if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { data: club } = await admin.from("clubs").select("slug").eq("id", profile.club_id).single();

    const formData = await request.formData();
    const logoFile = formData.get("logo");

    const updates = {};
    if (formData.has("primary_color")) updates.primary_color = formData.get("primary_color");
    if (formData.has("secondary_color")) updates.secondary_color = formData.get("secondary_color");
    if (formData.has("custom_notes")) updates.custom_notes = formData.get("custom_notes") || null;
    if (formData.has("custom_links")) {
      const raw = formData.get("custom_links");
      if (raw) {
        try {
          updates.custom_links = JSON.parse(raw);
        } catch {
          return NextResponse.json({ error: "Invalid links data — please refresh and try again." }, { status: 400 });
        }
      } else {
        updates.custom_links = null;
      }
    }
    if (formData.has("club_documents")) {
      const raw = formData.get("club_documents");
      if (raw) {
        try {
          updates.club_documents = JSON.parse(raw);
        } catch {
          return NextResponse.json({ error: "Invalid documents data — please refresh and try again." }, { status: 400 });
        }
      } else {
        updates.club_documents = null;
      }
    }

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
  } catch (err) {
    console.error("[branding] unhandled error:", err);
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
