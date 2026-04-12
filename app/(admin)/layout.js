export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-56 bg-white border-r border-border flex flex-col py-6 px-4 gap-1 shrink-0">
        <a href="/"><img src="/settlyou-logo.png" alt="Settl" className="h-8 rounded-md mx-2 mb-1" /></a>
        <span className="text-xs text-muted px-2 mb-5 uppercase tracking-widest">Admin</span>
        <a href="/admin" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Leads
        </a>
        <a href="/admin/clients" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Clients
        </a>
        <a href="/admin/relocations" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Relocations
        </a>
        <a href="/admin/analytics" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Analytics
        </a>
        <a href="/admin/billing" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Billing
        </a>
        <div className="mt-auto pt-4 border-t border-border">
          <a href="/api/auth/signout" className="px-3 py-2 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface transition-colors block">
            Sign out
          </a>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
