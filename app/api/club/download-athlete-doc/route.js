import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request) {
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await admin
    .from("profiles").select("role").eq("id", user.id).single();
  if (!["club_admin", "coach", "admissions"].includes(profile?.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const docUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "document.pdf";
  if (!docUrl) return NextResponse.json({ error: "Missing url param" }, { status: 400 });

  const match = docUrl.match(/\/storage\/v1\/object\/(?:public|sign)\/athlete-documents\/(.+?)(?:\?.*)?$/);
  if (!match) {
    return new NextResponse("Could not parse storage path", { status: 400 });
  }

  const storagePath = decodeURIComponent(match[1]);

  const { data: fileBlob, error } = await admin.storage
    .from("athlete-documents")
    .download(storagePath);

  if (error || !fileBlob) {
    return new NextResponse(`Download failed: ${error?.message || "unknown"}`, { status: 500 });
  }

  const buffer = await fileBlob.arrayBuffer();
  const ext = filename.split(".").pop()?.toLowerCase();
  const contentType = ext === "pdf" ? "application/pdf"
    : ext === "jpg" || ext === "jpeg" ? "image/jpeg"
    : ext === "png" ? "image/png"
    : "application/octet-stream";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
      "Content-Length": buffer.byteLength.toString(),
    },
  });
}
