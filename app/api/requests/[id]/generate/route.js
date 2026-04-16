import { NextResponse } from "next/server";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateRelocationDocument } from "@/lib/ai/generate-document";

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

  // Fetch the request
  const { data: relocationRequest, error: fetchError } = await admin
    .from("requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !relocationRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  // Fetch club data
  if (relocationRequest.club_id) {
    const { data: club } = await admin
      .from("clubs")
      .select("custom_notes, logo_url, primary_color, plan")
      .eq("id", relocationRequest.club_id)
      .single();
    if (club?.plan === "premium" && club?.custom_notes) relocationRequest.club_custom_notes = club.custom_notes;
    if (club?.logo_url) relocationRequest.club_logo_url = club.logo_url;
    if (club?.primary_color) relocationRequest.club_primary_color = club.primary_color;
  }

  // Mark as generating and return immediately — generation runs in background
  await admin.from("requests").update({ status: "generating" }).eq("id", id);
  console.log("[generate] status set to generating, returning 202...");

  after(async () => {
    console.log("[generate] background: calling AI...");
    try {
      const document = await generateRelocationDocument(relocationRequest);
      console.log("[generate] background: AI responded, saving document...");

      // Override meta with real club data
      if (relocationRequest.club_logo_url) document.meta.club_logo_url = relocationRequest.club_logo_url;
      if (relocationRequest.club_primary_color) document.meta.club_primary_color = relocationRequest.club_primary_color;

      const { error: docError } = await admin
        .from("documents")
        .insert({ request_id: id, content: document, language: "en" });

      if (docError) throw new Error(docError.message);

      await admin.from("requests").update({ status: "under_review" }).eq("id", id);
      console.log("[generate] background: done, status set to under_review");
    } catch (err) {
      await admin.from("requests").update({ status: "submitted" }).eq("id", id);
      console.error("[generate] background error:", err);
    }
  });

  return NextResponse.json({ ok: true, generating: true });
}
