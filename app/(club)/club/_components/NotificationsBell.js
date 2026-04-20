"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SEEN_KEY = "settl_notifications_seen";

export default function NotificationsBell() {
  const [unread, setUnread] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/club/notifications/count");
        const { count } = await res.json();
        if (count === 0) { setUnread(false); return; }
        const seen = parseInt(localStorage.getItem(SEEN_KEY) || "0");
        setUnread(count > seen);
      } catch {}
    }
    check();
  }, [pathname]);

  // Mark as read when visiting notifications page
  useEffect(() => {
    if (!pathname.includes("/notifications")) return;
    async function markRead() {
      try {
        const res = await fetch("/api/club/notifications/count");
        const { count } = await res.json();
        localStorage.setItem(SEEN_KEY, String(count));
        setUnread(false);
      } catch {}
    }
    markRead();
  }, [pathname]);

  return (
    <a
      id="tour-nav-notifications"
      href="/club/notifications"
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/club/notifications" ? "bg-brand-50 text-brand-700" : "text-foreground hover:bg-brand-50 hover:text-brand-700"}`}
    >
      <div className="relative shrink-0">
        <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full" />
        )}
      </div>
      Notifications
    </a>
  );
}
