import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(request, { params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Verify request belongs to this club
  const { data: req } = await admin
    .from("requests").select("id, club_id").eq("id", id).eq("club_id", profile.club_id).single();
  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await admin.from("documents").delete().eq("request_id", id);
  await admin.from("events").delete().eq("request_id", id);
  await admin.from("requests").delete().eq("id", id);

  return NextResponse.json({ ok: true });
}
