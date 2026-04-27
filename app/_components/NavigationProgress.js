"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(pathname);

  // Detect link clicks to start loading before the page fetches
  useEffect(() => {
    function handleClick(e) {
      const anchor = e.target.closest("a");
      if (!anchor || !anchor.href) return;
      if (anchor.target === "_blank") return;
      try {
        const url = new URL(anchor.href);
        if (url.origin !== window.location.origin) return;
        if (url.pathname === window.location.pathname) return;
        setLoading(true);
      } catch {}
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Hide once the new page has loaded (pathname changed)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      setLoading(false);
    }
  }, [pathname]);

  if (!loading) return null;

  const hasSidebar = pathname.startsWith("/club") || pathname.startsWith("/admin");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${hasSidebar ? "left-56" : "left-0"}`}
      style={{ background: "rgba(249,250,251,0.85)", backdropFilter: "blur(6px)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <img
          src="/settlyou-logo-dark.png"
          alt="Settlyou"
          className="h-8 animate-pulse"
        />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-500"
              style={{ animation: `bounce 0.9s ease-in-out ${i * 0.18}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
