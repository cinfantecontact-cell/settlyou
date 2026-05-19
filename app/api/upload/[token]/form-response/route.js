import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request, { params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: req } = await admin
    .from("requests")
    .select("id")
    .eq("upload_token", token)
    .single();

  if (!req) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  const { question_id, answer } = await request.json();
  if (!question_id) return NextResponse.json({ error: "question_id is required" }, { status: 400 });

  const { error } = await admin
    .from("athlete_form_responses")
    .upsert(
      { request_id: req.id, question_id, answer, updated_at: new Date().toISOString() },
      { onConflict: "request_id,question_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
