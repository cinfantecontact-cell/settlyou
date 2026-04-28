import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDocumentReminder } from "@/lib/email/send";
import { getSportDocTypes } from "@/lib/documents/types";

const MAX_REMINDERS = 3;
const REMINDER_INTERVAL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days
const FIRST_REMINDER_DELAY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days after delivery

export async function GET(request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date();

  // 1. Fetch all delivered requests that have an email and upload token
  const { data: requests } = await admin
    .from("requests")
    .select("id, club_id, athlete_name, athlete_email, sport, upload_token, updated_at")
    .eq("status", "delivered")
    .not("athlete_email", "is", null)
    .not("upload_token", "is", null);

  if (!requests?.length) return NextResponse.json({ ok: true, sent: 0 });

  const requestIds = requests.map(r => r.id);
  const clubSportPairs = [...new Set(requests.map(r => `${r.club_id}:${r.sport}`))];

  // 2. Batch fetch uploaded documents, sport configs, reminder events, and club names
  const [
    { data: uploadedDocs },
    { data: sportConfigs },
    { data: reminderEvents },
    { data: clubs },
  ] = await Promise.all([
    admin.from("athlete_documents")
      .select("request_id, document_type")
      .in("request_id", requestIds),
    admin.from("sport_document_config")
      .select("club_id, sport, disabled_base_docs, custom_docs"),
    admin.from("events")
      .select("request_id, created_at")
      .in("request_id", requestIds)
      .eq("event_type", "doc_reminder_sent")
      .order("created_at", { ascending: false }),
    admin.from("clubs")
      .select("id, name")
      .in("id", [...new Set(requests.map(r => r.club_id))]),
  ]);

  // Index for fast lookup
  const uploadedByRequest = {};
  for (const doc of uploadedDocs ?? []) {
    if (!uploadedByRequest[doc.request_id]) uploadedByRequest[doc.request_id] = new Set();
    uploadedByRequest[doc.request_id].add(doc.document_type);
  }

  const sportConfigMap = {};
  for (const cfg of sportConfigs ?? []) {
    sportConfigMap[`${cfg.club_id}:${cfg.sport}`] = cfg;
  }

  // Group reminder events by request_id
  const remindersByRequest = {};
  for (const ev of reminderEvents ?? []) {
    if (!remindersByRequest[ev.request_id]) remindersByRequest[ev.request_id] = [];
    remindersByRequest[ev.request_id].push(ev);
  }

  const clubNameById = {};
  for (const c of clubs ?? []) clubNameById[c.id] = c.name;

  let sent = 0;
  const errors = [];

  for (const req of requests) {
    try {
      // Get required docs for this sport
      const sportConfig = sportConfigMap[`${req.club_id}:${req.sport}`] ?? null;
      const requiredDocs = getSportDocTypes(sportConfig);

      // Find missing docs
      const uploaded = uploadedByRequest[req.id] ?? new Set();
      const missingDocs = requiredDocs.filter(d => !uploaded.has(d.key));
      if (!missingDocs.length) continue; // All docs uploaded — skip

      // Check reminder history
      const priorReminders = remindersByRequest[req.id] ?? [];
      if (priorReminders.length >= MAX_REMINDERS) continue; // Hit limit — stop

      const deliveredAt = new Date(req.updated_at);
      const lastReminderAt = priorReminders[0] ? new Date(priorReminders[0].created_at) : null;
      const referenceTime = lastReminderAt ?? deliveredAt;
      const elapsed = now - referenceTime;

      const delay = priorReminders.length === 0 ? FIRST_REMINDER_DELAY_MS : REMINDER_INTERVAL_MS;
      if (elapsed < delay) continue; // Too soon — skip

      const reminderCount = priorReminders.length + 1;
      const clubName = clubNameById[req.club_id] ?? "your institution";

      await sendDocumentReminder({
        athleteName: req.athlete_name,
        athleteEmail: req.athlete_email,
        clubName,
        uploadToken: req.upload_token,
        missingDocs: missingDocs.map(d => d.label),
        reminderCount,
      });

      // Log the event so we don't re-send too soon
      await admin.from("events").insert({
        event_type: "doc_reminder_sent",
        request_id: req.id,
        club_id: req.club_id,
        metadata: { reminder_count: reminderCount, missing_count: missingDocs.length },
      });

      sent++;
    } catch (e) {
      errors.push({ request_id: req.id, athlete: req.athlete_name, error: e.message });
    }
  }

  return NextResponse.json({ ok: true, sent, errors });
}
