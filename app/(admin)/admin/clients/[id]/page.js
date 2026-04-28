export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import ResetPasswordButton from "../_components/ResetPasswordButton";
import InviteCoachForm from "../_components/InviteCoachForm";

export default async function AdminClientDetailPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "settl_admin") redirect("/dashboard");

  const { data: club } = await admin.from("clubs").select("*").eq("id", id).single();
  if (!club) notFound();

  const [{ data: adProfile }, { data: coaches }, { data: pending }, { data: coachNotes }] = await Promise.all([
    admin.from("profiles").select("id, full_name").eq("club_id", id).eq("role", "club_admin").single(),
    admin.from("profiles").select("id, full_name, sport").eq("club_id", id).eq("role", "coach").order("full_name"),
    admin.from("coach_invites").select("id, email, sport, created_at").eq("club_id", id).eq("accepted", false).order("created_at", { ascending: false }),
    admin.from("coach_sport_notes").select("sport, custom_notes, custom_links").eq("club_id", id),
  ]);

  const notesBySport = Object.fromEntries((coachNotes ?? []).map(n => [n.sport, n]));

  const adUser = adProfile ? await admin.auth.admin.getUserById(adProfile.id) : null;
  const adEmail = adUser?.data?.user?.email ?? "—";

  // Fetch emails for all coaches
  const coachEmails = {};
  if (coaches?.length) {
    await Promise.all(
      coaches.map(async (c) => {
        const { data } = await admin.auth.admin.getUserById(c.id);
        coachEmails[c.id] = data?.user?.email ?? "—";
      })
    );
  }

  return (
    <div className="p-8 max-w-4xl flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <a href="/admin/clients" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors">
          Clients
        </a>
      </div>

      <div className="flex items-center gap-4">
        {club.logo_url ? (
          <img src={club.logo_url} alt="" className="w-12 h-12 object-contain rounded-xl border border-border p-1" />
        ) : (
          <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-sm font-bold text-muted bg-surface">
            {club.name?.[0]?.toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{club.name}</h1>
          <p className="text-sm text-muted">{[club.city, club.country].filter(Boolean).join(", ")}{club.division ? ` · ${club.division}` : ""}</p>
        </div>
        <a href={`/admin/clubs/${id}/edit`} className="ml-auto text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors">
          Edit university
        </a>
      </div>

      {/* AD Account */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Athletic Director Account</h2>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">{adProfile?.full_name || "—"}</p>
            <p className="text-xs text-muted mt-0.5">{adEmail}</p>
          </div>
          {adEmail !== "—" && <ResetPasswordButton email={adEmail} />}
        </div>
      </div>

      {/* Coaches */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Coaches</h2>
          <span className="text-xs text-muted">{coaches?.length ?? 0} active</span>
        </div>
        {coaches?.length ? (
          <div className="divide-y divide-border">
            {coaches.map(c => {
              const notes = notesBySport[c.sport];
              const email = coachEmails[c.id] ?? "—";
              return (
                <div key={c.id} className="px-6 py-4 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.full_name || "—"}</p>
                      <p className="text-xs text-muted mt-0.5">{email} · {c.sport}</p>
                    </div>
                    <ResetPasswordButton userId={c.id} />
                  </div>
                  {notes?.custom_notes && (
                    <div className="bg-surface border border-border rounded-lg px-4 py-3">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">Guide notes</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{notes.custom_notes}</p>
                    </div>
                  )}
                  {notes?.custom_links?.length > 0 && (
                    <div className="bg-surface border border-border rounded-lg px-4 py-3">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Custom links</p>
                      <div className="flex flex-col gap-1">
                        {notes.custom_links.map((link, i) => (
                          <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-brand-600 hover:underline">
                            {link.label || link.url}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {!notes?.custom_notes && !notes?.custom_links?.length && (
                    <p className="text-xs text-muted italic">No guide notes added yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted">No coaches yet. The AD can invite coaches from their portal.</p>
          </div>
        )}
      </div>

      {/* Invite a coach */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Invite a Coach</h2>
        </div>
        <div className="px-6 py-4">
          <InviteCoachForm clubId={id} />
        </div>
      </div>

      {/* Pending invites */}
      {pending?.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-surface">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Pending Coach Invites</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sent</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 text-foreground">{p.email}</td>
                  <td className="px-6 py-3 text-muted">{p.sport}</td>
                  <td className="px-6 py-3 text-muted">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
