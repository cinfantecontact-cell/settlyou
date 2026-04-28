import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import DocumentView from "./_components/DocumentView";
import ApproveButton from "./_components/ApproveButton";
import RegenerateButton from "./_components/RegenerateButton";
import FormAnswers from "./_components/FormAnswers";
import EditDocumentFields from "./_components/EditDocumentFields";

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
    .from("requests").select("*, organizations(name), clubs(name, logo_url, primary_color, custom_notes, custom_links, club_documents)").eq("id", id).single();

  const { data: document } = await admin
    .from("documents").select("*").eq("request_id", id)
    .order("generated_at", { ascending: false }).limit(1).single();

  if (!request) redirect("/admin/relocations");

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-10 flex items-start justify-between">
        <div>
          <a href="/admin/relocations" className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors">
            Back to relocations
          </a>
          <h1 className="text-3xl font-bold text-foreground mt-5">
            {request.athlete_name}
          </h1>
          <p className="text-sm text-muted mt-2">
            {request.destination_city}, {request.destination_country} · {request.organizations?.name ?? request.clubs?.name ?? "—"} · <span className="capitalize">{request.service_tier ?? "standard"}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          {document && document.generated_at && request.created_at && (
            <span className="text-xs text-muted">
              Generated in {(() => {
                const secs = Math.round((new Date(document.generated_at) - new Date(request.created_at)) / 1000);
                if (secs < 60) return `${secs}s`;
                const m = Math.floor(secs / 60), s = secs % 60;
                return s > 0 ? `${m}m ${s}s` : `${m}m`;
              })()}
            </span>
          )}
          {document && request.status === "under_review" && (
            <ApproveButton requestId={id} documentId={document.id} athleteToken={request.athlete_link_token} />
          )}
          <div className="flex items-center gap-2">
            <RegenerateButton requestId={id} />
            {document && (
              <EditDocumentFields
                documentId={document.id}
                welcomeLetter={document.content?.meta?.welcome_letter}
                generatedSummary={document.content?.meta?.generated_summary}
              />
            )}
          </div>
          {["under_review", "approved", "delivered"].includes(request.status) && request.athlete_link_token && (
            <div className="flex items-center gap-2">
              {(request.status === "approved" || request.status === "delivered") && (
                <span className="text-xs bg-brand-100 text-brand-800 px-3 py-1 rounded-full font-medium">Approved</span>
              )}
              <a
                href={`/report/${request.athlete_link_token}`}
                target="_blank"
                className="text-sm font-medium px-4 py-2 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
              >
                Open guide
              </a>
            </div>
          )}
        </div>
      </div>

      <FormAnswers request={request} />

      <div className="mt-10">
      {document ? (
        <DocumentView content={{
          ...document.content,
          meta: {
            ...document.content?.meta,
            ...(request.clubs?.logo_url && { club_logo_url: request.clubs.logo_url }),
            ...(request.clubs?.primary_color && { club_primary_color: request.clubs.primary_color }),
          },
          university_documents: request.clubs?.club_documents || null,
        }} />
      ) : (
        <div className="bg-white rounded-xl border border-border p-12 text-center text-sm text-muted">
          No document generated yet.
        </div>
      )}
      </div>
    </div>
  );
}
