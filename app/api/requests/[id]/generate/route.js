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
      .select("custom_notes, custom_links, club_documents, logo_url, primary_color, plan, division")
      .eq("id", relocationRequest.club_id)
      .single();
    if (club?.custom_notes) relocationRequest.club_custom_notes = club.custom_notes;
    if (club?.custom_links?.length) relocationRequest.club_custom_links = club.custom_links;
    if (club?.club_documents?.length) relocationRequest.club_documents = club.club_documents;
    if (club?.logo_url) relocationRequest.club_logo_url = club.logo_url;
    if (club?.primary_color) relocationRequest.club_primary_color = club.primary_color;
    if (club?.division) relocationRequest.division = club.division;

    if (relocationRequest.sport) {
      const normSport = s => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const { data: allSportNotes } = await admin
        .from("coach_sport_notes")
        .select("sport, custom_notes, custom_links")
        .eq("club_id", relocationRequest.club_id);
      const coachNotes = allSportNotes?.find(n => normSport(n.sport) === normSport(relocationRequest.sport));
      if (!coachNotes) console.warn("[generate] no coach notes found for sport:", relocationRequest.sport, "| available:", allSportNotes?.map(n => n.sport));
      if (coachNotes?.custom_notes) {
        relocationRequest.coach_notes_raw = coachNotes.custom_notes;
        relocationRequest.club_custom_notes =
          (relocationRequest.club_custom_notes ? relocationRequest.club_custom_notes + "\n\n" : "") +
          `[${relocationRequest.sport} Coach Notes]\n${coachNotes.custom_notes}`;
      }
      if (coachNotes?.custom_links?.length) {
        relocationRequest.coach_links_raw = coachNotes.custom_links;
        relocationRequest.club_custom_links = [
          ...(relocationRequest.club_custom_links ?? []),
          ...coachNotes.custom_links,
        ];
      }
    }
  }

  // Mark as generating and return immediately — generation runs in background
  await admin.from("requests").update({ status: "generating" }).eq("id", id);
  console.log("[generate] status set to generating, returning 202...");

  after(async () => {
    console.log("[generate] background: calling AI...");
    try {
      // Look up pre-generated base data for this club
      let baseData = null;
      if (relocationRequest.club_id) {
        const { data: base } = await admin
          .from("city_base_data")
          .select("content")
          .eq("club_id", relocationRequest.club_id)
          .eq("language", "en")
          .eq("status", "ready")
          .single();
        if (base?.content) {
          baseData = base.content;
          console.log("[generate] using pre-generated base data (two-tier)");
        }
      }

      const document = await Promise.race([
        generateRelocationDocument(relocationRequest, baseData),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Generation timed out after 4 minutes")), 4 * 60 * 1000)
        ),
      ]);
      console.log("[generate] background: AI responded, saving document...");

      // Override meta with real club data
      if (relocationRequest.club_logo_url) document.meta.club_logo_url = relocationRequest.club_logo_url;
      if (relocationRequest.club_primary_color) document.meta.club_primary_color = relocationRequest.club_primary_color;
      if (relocationRequest.coach_notes_raw) document.meta.coach_notes = relocationRequest.coach_notes_raw;
      if (relocationRequest.coach_links_raw?.length) document.meta.coach_links = relocationRequest.coach_links_raw;

      const { error: docError } = await admin
        .from("documents")
        .insert({ request_id: id, content: document, language: "en" });

      if (docError) throw new Error(docError.message);

      // Hard guarantee: verify coach notes are in the saved document — patch if missing
      if (relocationRequest.coach_notes_raw) {
        const { data: savedDoc } = await admin
          .from("documents").select("id, content").eq("request_id", id).single();
        if (savedDoc && !savedDoc.content?.meta?.coach_notes) {
          console.error("[generate] CRITICAL: coach notes missing from saved document, patching...");
          await admin.from("documents").update({
            content: {
              ...savedDoc.content,
              meta: { ...savedDoc.content.meta, coach_notes: relocationRequest.coach_notes_raw, ...(relocationRequest.coach_links_raw?.length && { coach_links: relocationRequest.coach_links_raw }) },
            },
          }).eq("id", savedDoc.id);
        }
      }

      await admin.from("requests").update({ status: "under_review" }).eq("id", id);
      console.log("[generate] background: done, status set to under_review");
    } catch (err) {
      await admin.from("requests").update({ status: "submitted" }).eq("id", id);
      console.error("[generate] background error:", err);
    }
  });

  return NextResponse.json({ ok: true, generating: true });
}
