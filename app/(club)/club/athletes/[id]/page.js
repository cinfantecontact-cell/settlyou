export const dynamic = 'force-dynamic';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import AthleteActions from "./_components/AthleteActions";

export default async function ClubAthletePage({ params }) {
  const supabase = await createClient();
  const admin = createAdminClient();
  const { id } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin
    .from("profiles").select("role, club_id").eq("id", user.id).single();
  if (profile?.role !== "club_admin") redirect("/login");

  const { data: request } = await admin
    .from("requests")
    .select("*, clubs(name)")
    .eq("id", id)
    .eq("club_id", profile.club_id)
    .single();

  if (!request) notFound();

  const reportUrl = request.athlete_link_token
    ? `${process.env.NEXT_PUBLIC_APP_URL}/report/${request.athlete_link_token}`
    : null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <a href="/club/athletes" className="text-sm text-muted hover:text-foreground transition-colors">← Back to athletes</a>
      </div>

      {/* Header */}
      <div className="bg-white border border-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">{request.athlete_name || "Athlete"}</h1>
            <p className="text-sm text-muted mt-1">{request.athlete_email || "No email"}</p>
            <p className="text-sm text-muted">{request.destination_city}{request.destination_country ? `, ${request.destination_country}` : ""}</p>
          </div>
          <StatusBadge status={request.status} />
        </div>
        <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted">Sport</span>
            <p className="font-medium text-foreground mt-0.5">{request.sport || "—"}</p>
          </div>
          <div>
            <span className="text-muted">Move date</span>
            <p className="font-medium text-foreground mt-0.5">{request.move_date || "—"}</p>
          </div>
          <div>
            <span className="text-muted">Submitted</span>
            <p className="font-medium text-foreground mt-0.5">{new Date(request.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <span className="text-muted">Family size</span>
            <p className="font-medium text-foreground mt-0.5">{request.family_size || 1}</p>
          </div>
        </div>
      </div>

      {/* Report link */}
      {reportUrl && (
        <div className="bg-white border border-border rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-foreground mb-3">Report Link</h2>
          <div className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-3">
            <p className="text-xs text-muted flex-1 truncate">{reportUrl}</p>
            <a
              href={reportUrl}
              target="_blank"
              className="text-xs text-brand-600 font-semibold hover:underline shrink-0"
            >
              Open →
            </a>
          </div>
        </div>
      )}

      {/* Actions */}
      <AthleteActions
        requestId={id}
        athleteEmail={request.athlete_email}
        athleteName={request.athlete_name}
        reportToken={request.athlete_link_token}
        status={request.status}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    submitted: { label: "Submitted", class: "bg-blue-50 text-blue-700" },
    generating: { label: "Generating", class: "bg-yellow-50 text-yellow-700" },
    under_review: { label: "Under Review", class: "bg-orange-50 text-orange-700" },
    approved: { label: "Approved", class: "bg-green-50 text-green-700" },
    delivered: { label: "Delivered", class: "bg-brand-50 text-brand-700" },
  };
  const s = map[status] || { label: status, class: "bg-surface text-muted" };
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.class}`}>{s.label}</span>;
}
