import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDocumentReminder } from "@/lib/email/send";

export async function POST(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await sendDocumentReminder({
    athleteName: "Lucas Fernández",
    athleteEmail: "hello@settlyou.com",
    clubName: "Bethel University",
    uploadToken: "preview-token-do-not-use",
    missingDocs: ["Passport Copy", "Health Insurance Card", "NAIA / NCAA Eligibility Form"],
    reminderCount: 1,
  });

  return NextResponse.json({ ok: true });
}
