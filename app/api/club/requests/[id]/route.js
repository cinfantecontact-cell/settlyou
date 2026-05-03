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
    .from("profiles").select("role, club_id, sport").eq("id", user.id).single();
  if (!["club_admin", "coach"].includes(profile?.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // Verify request belongs to this club (coaches also scoped to their sport)
  let query = admin.from("requests").select("id, club_id, sport").eq("id", id).eq("club_id", profile.club_id);
  if (profile.role === "coach") query = query.eq("sport", profile.sport);
  const { data: req } = await query.single();
  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Soft delete — keeps the record visible in the admin view
  const { error } = await admin
    .from("requests")
    .update({ deleted_at: new Date().toISOString(), deleted_by: profile.role })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
