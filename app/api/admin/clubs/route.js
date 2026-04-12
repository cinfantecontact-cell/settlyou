import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const name = formData.get("name");
  const slug = formData.get("slug")?.toLowerCase().trim();
  const type = formData.get("type");
  const seat_limit = parseInt(formData.get("seat_limit")) || 10;
  const primary_color = formData.get("primary_color") || "#111111";
  const secondary_color = formData.get("secondary_color") || "#ffffff";
  const pin = formData.get("pin");
  const logoFile = formData.get("logo");
  const custom_notes = formData.get("custom_notes") || null;
  const address = formData.get("address") || null;
  const city = formData.get("city") || null;
  const country = formData.get("country") || null;

  // Upload logo if provided
  let logo_url = null;
  if (logoFile && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop();
    const path = `${slug}.${ext}`;
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("club-logos")
      .upload(path, buffer, {
        contentType: logoFile.type,
        upsert: true,
      });

    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage
        .from("club-logos")
        .getPublicUrl(path);
      logo_url = publicUrl;
    }
  }

  const { error } = await admin.from("clubs").insert({
    name,
    slug,
    type,
    seat_limit,
    primary_color,
    secondary_color,
    pin,
    logo_url,
    custom_notes,
    address,
    city,
    country,
    active: true,
    seats_used: 0,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
