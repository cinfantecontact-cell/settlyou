"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SEEN_KEY = "settl_athletes_seen";

export default function AthletesNavItem() {
  const [unread, setUnread] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/club/athletes/count");
        const { count } = await res.json();
        if (count === 0) { setUnread(false); return; }
        const seen = parseInt(localStorage.getItem(SEEN_KEY) || "0");
        setUnread(count > seen);
      } catch {}
    }
    check();
  }, [pathname]);

  // Mark as read when visiting athletes page
  useEffect(() => {
    if (!pathname.includes("/athletes")) return;
    async function markRead() {
      try {
        const res = await fetch("/api/club/athletes/count");
        const { count } = await res.json();
        localStorage.setItem(SEEN_KEY, String(count));
        setUnread(false);
      } catch {}
    }
    markRead();
  }, [pathname]);

  return (
    <a
      id="tour-nav-athletes"
      href="/club/athletes"
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${pathname.startsWith("/club/athletes") ? "bg-brand-50 text-brand-700 shadow-sm border border-brand-100" : "text-muted hover:bg-surface hover:text-foreground"}`}
    >
      <div className="relative shrink-0">
        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {unread && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full" />
        )}
      </div>
      Students
    </a>
  );
}
