import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "club_admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const url = new URL(request.url);
  const docUrl = url.searchParams.get("url");
  if (!docUrl) return NextResponse.json({ error: "Missing url param" }, { status: 400 });

  // Extract storage path from the public URL
  // Format: https://[project].supabase.co/storage/v1/object/public/club-documents/[path]
  const match = docUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/club-documents\/(.+?)(?:\?.*)?$/);
  if (!match) {
    return new NextResponse(`Could not parse storage path from URL: ${docUrl}`, {
      status: 400, headers: { "Content-Type": "text/plain" },
    });
  }

  const storagePath = decodeURIComponent(match[1]);

  const { data: fileBlob, error } = await admin.storage
    .from("club-documents")
    .download(storagePath);

  if (error || !fileBlob) {
    return new NextResponse(`Storage download failed: ${error?.message || "unknown"} (path: ${storagePath})`, {
      status: 500, headers: { "Content-Type": "text/plain" },
    });
  }

  const buffer = await fileBlob.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  if (bytes.byteLength === 0) {
    return new NextResponse(`File is empty in storage (path: ${storagePath})`, {
      status: 404, headers: { "Content-Type": "text/plain" },
    });
  }


  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=\"document.pdf\"",
      "Content-Length": bytes.byteLength.toString(),
    },
  });
}
