import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DocumentView from "./_components/DocumentView";
import ApproveButton from "./_components/ApproveButton";
import FormAnswers from "./_components/FormAnswers";

export default async function AdminRelocationDocumentPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: request } = await admin
    .from("requests").select("*, organizations(name), clubs(name, logo_url, primary_color)").eq("id", id).single();

  const { data: document } = await admin
    .from("documents").select("*").eq("request_id", id)
    .order("generated_at", { ascending: false }).limit(1).single();

  if (!request) redirect("/admin/relocations");

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <a href="/admin/relocations" className="text-sm text-muted hover:text-foreground transition-colors">
            ← Back to relocations
          </a>
          <h1 className="text-2xl font-bold text-foreground mt-3">
            {request.athlete_name}
          </h1>
          <p className="text-sm text-muted mt-1">
            {request.destination_city}, {request.destination_country} · {request.organizations?.name ?? request.clubs?.name ?? "—"} · <span className="capitalize">{request.service_tier ?? "standard"}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {document && request.status === "under_review" && (
            <ApproveButton requestId={id} documentId={document.id} athleteToken={request.athlete_link_token} />
          )}
          {["under_review", "approved", "delivered"].includes(request.status) && request.athlete_link_token && (
            <>
              {(request.status === "approved" || request.status === "delivered") && (
                <span className="text-xs bg-brand-100 text-brand-800 px-3 py-1 rounded-full font-medium">Approved</span>
              )}
              <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2">
                <span className="text-xs text-muted font-mono truncate max-w-[220px]">
                  {process.env.NEXT_PUBLIC_APP_URL}/report/{request.athlete_link_token}
                </span>
                <a
                  href={`/report/${request.athlete_link_token}`}
                  target="_blank"
                  className="text-xs text-brand-600 hover:underline shrink-0 font-medium"
                >
                  Open ↗
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <FormAnswers request={request} />

      {document ? (
        <DocumentView content={{
          ...document.content,
          meta: {
            ...document.content?.meta,
            ...(request.clubs?.logo_url && { club_logo_url: request.clubs.logo_url }),
            ...(request.clubs?.primary_color && { club_primary_color: request.clubs.primary_color }),
          }
        }} />
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-muted">
          No document generated yet.
        </div>
      )}
    </div>
  );
}
