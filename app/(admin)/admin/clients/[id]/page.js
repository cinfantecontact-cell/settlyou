export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import ResetPasswordButton from "../_components/ResetPasswordButton";

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

  const [{ data: adProfile }, { data: coaches }, { data: pending }] = await Promise.all([
    admin.from("profiles").select("id, full_name").eq("club_id", id).eq("role", "club_admin").single(),
    admin.from("profiles").select("id, full_name, sport").eq("club_id", id).eq("role", "coach").order("full_name"),
    admin.from("coach_invites").select("id, email, sport, created_at").eq("club_id", id).eq("accepted", false).order("created_at", { ascending: false }),
  ]);

  const adUser = adProfile ? await admin.auth.admin.getUserById(adProfile.id) : null;
  const adEmail = adUser?.data?.user?.email ?? "—";

  return (
    <div className="p-8 max-w-3xl flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <a href="/admin/clients" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors">
          ← Clients
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
          <div className="flex items-center gap-2">
            {adEmail !== "—" && <ResetPasswordButton email={adEmail} />}
            <a
              href={`/admin/clubs/${id}/edit`}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-brand-200 text-brand-600 hover:bg-brand-50 transition-colors"
            >
              Edit club
            </a>
          </div>
        </div>
      </div>

      {/* Coaches */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-surface flex items-center justify-between">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">Coaches</h2>
          <span className="text-xs text-muted">{coaches?.length ?? 0} active</span>
        </div>
        {coaches?.length ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs text-muted font-medium uppercase tracking-wider">Sport</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {coaches.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium text-foreground">{c.full_name || "—"}</td>
                  <td className="px-6 py-3 text-muted">{c.sport}</td>
                  <td className="px-6 py-3 text-right">
                    <ResetPasswordButton userId={c.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted">No coaches yet. The AD can invite coaches from their portal.</p>
          </div>
        )}
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
