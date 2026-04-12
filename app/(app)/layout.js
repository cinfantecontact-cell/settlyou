export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="w-56 bg-white border-r border-border flex flex-col py-6 px-4 gap-1 shrink-0">
        <span className="text-xl font-bold text-brand-600 tracking-tight px-2 mb-6">Settl</span>
        <a href="/dashboard" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          Dashboard
        </a>
        <a href="/requests" className="px-3 py-2 rounded-md text-sm text-foreground hover:bg-brand-50 hover:text-brand-700 transition-colors">
          All Guides
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
