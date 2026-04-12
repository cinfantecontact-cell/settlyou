export const dynamic = 'force-dynamic';
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import DocumentView from "@/app/(admin)/admin/relocations/[id]/_components/DocumentView";
import PrintButton from "./PrintButton";
import ReportTracker from "./ReportTracker";

export default async function AthleteReportPage({ params }) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data: request } = await admin
    .from("requests")
    .select("*, documents(*), clubs(logo_url, primary_color)")
    .eq("athlete_link_token", token)
    .in("status", ["under_review", "delivered", "approved"])
    .single();

  if (!request) notFound();

  const document = request.documents?.[0];

  return (
    <div className="min-h-screen bg-surface">
      <ReportTracker requestId={request.id} />
      <nav className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <img src="/settlyou-logo.png" alt="Settl" className="h-8 rounded-md" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted">Relocation Guide · {request.athlete_name}</span>
          <PrintButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
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
          <div className="text-center py-20 text-muted text-sm">
            Your relocation guide is being prepared. Check back soon.
          </div>
        )}
      </div>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        Prepared exclusively for {request.athlete_name} by Settl · Confidential
      </footer>
    </div>
  );
}
