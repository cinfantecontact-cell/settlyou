import { inviteClient } from "./actions";

export const metadata = { title: "Invite Client — Settl Admin" };

const COUNTRIES = [
  "United States", "Chile", "Mexico", "Argentina", "Brazil", "Colombia",
  "Spain", "England", "Germany", "France", "Italy", "Portugal", "Netherlands",
  "Other",
];

export default function InviteClientPage({ searchParams }) {
  const error = searchParams?.error;

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <a href="/admin/clients" className="text-sm text-muted hover:text-foreground transition-colors">
          ← Back to clients
        </a>
        <h1 className="text-2xl font-bold text-foreground mt-4">Invite a client</h1>
        <p className="text-sm text-muted mt-1">
          Creates the organization and sends the contact an email to set their password.
        </p>
      </div>

      {error && (
        <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error === "already_exists"
            ? "An account with that email already exists."
            : "Something went wrong. Please try again."}
        </div>
      )}

      <form action={inviteClient} className="bg-white rounded-xl border border-border p-6 flex flex-col gap-6">
        {/* Organization */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Organization</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="org_name" className="text-sm font-medium text-foreground">Name</label>
              <input
                id="org_name"
                name="org_name"
                type="text"
                required
                className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                placeholder="Club Deportivo Universidad"
              />
            </div>

            <input type="hidden" name="org_type" value="college" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="org_country" className="text-sm font-medium text-foreground">Country</label>
                <select
                  id="org_country"
                  name="org_country"
                  required
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                >
                  <option value="">Select...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="org_tier" className="text-sm font-medium text-foreground">Tier</label>
                <select
                  id="org_tier"
                  name="org_tier"
                  required
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition bg-white"
                >
                  <option value="essentials">Essentials — $1,499/yr</option>
                  <option value="premium">Premium — $2,499/yr</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Contact person */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Primary contact</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="contact_name" className="text-sm font-medium text-foreground">Full name</label>
                <input
                  id="contact_name"
                  name="contact_name"
                  type="text"
                  required
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="Juan García"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="contact_email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  required
                  className="border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  placeholder="juan@club.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <a
            href="/admin/clients"
            className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </a>
          <button
            type="submit"
            className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-brand-700 transition-colors"
          >
            Create & send invite
          </button>
        </div>
      </form>
    </div>
  );
}
