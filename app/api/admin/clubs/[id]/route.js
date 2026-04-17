import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const name = formData.get("name");
  const type = formData.get("type");
  const seat_limit = parseInt(formData.get("seat_limit")) || 10;
  const primary_color = formData.get("primary_color");
  const secondary_color = formData.get("secondary_color") || "#ffffff";
  const active = formData.get("active") === "true";
  const newPin = formData.get("pin");
  const logoFile = formData.get("logo");
  const custom_notes = formData.get("custom_notes") || null;
  const plan = formData.get("plan") || "essentials";

  // Build update object — branding only for premium
  const updates = { name, type, seat_limit, active, plan };
  if (plan === "premium") {
    updates.primary_color = primary_color;
    updates.secondary_color = secondary_color;
    updates.custom_notes = custom_notes;
  } else {
    // Clear branding if downgraded to essentials
    updates.custom_notes = null;
  }

  // Only update PIN if a new one was provided
  if (newPin && newPin.length === 4) {
    updates.pin = newPin;
  }

  // Upload new logo if provided — premium only
  if (plan === "premium" && logoFile && logoFile.size > 0) {
    const { data: existing } = await admin.from("clubs").select("slug").eq("id", id).single();
    const ext = logoFile.name.split(".").pop();
    const path = `${existing.slug}.${ext}`;
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await admin.storage
      .from("club-logos")
      .upload(path, buffer, { contentType: logoFile.type, upsert: true });

    if (!uploadError) {
      const { data: { publicUrl } } = admin.storage.from("club-logos").getPublicUrl(path);
      updates.logo_url = publicUrl;
    }
  }

  const { error } = await admin.from("clubs").update(updates).eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Delete all related records before deleting the club
  const { data: requests } = await admin.from("requests").select("id").eq("club_id", id);
  if (requests?.length) {
    const requestIds = requests.map((r) => r.id);
    await admin.from("documents").delete().in("request_id", requestIds);
    await admin.from("events").delete().in("request_id", requestIds);
    await admin.from("requests").delete().eq("club_id", id);
  }
  await admin.from("events").delete().eq("club_id", id);
  await admin.from("billing").delete().eq("club_id", id);
  await admin.from("profiles").update({ club_id: null }).eq("club_id", id);

  const { error } = await admin.from("clubs").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
