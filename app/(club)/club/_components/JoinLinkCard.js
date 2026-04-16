"use client";

import { useState } from "react";

export default function JoinLinkCard({ slug, pin, clubName }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://settlyou.com";
  const joinUrl = `${baseUrl}/join/${slug}`;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [showPin, setShowPin] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(joinUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function copyPin() {
    navigator.clipboard.writeText(pin);
    setCopiedPin(true);
    setTimeout(() => setCopiedPin(false), 2000);
  }

  function shareByEmail() {
    const subject = encodeURIComponent(`Your Settlyou relocation guide — ${clubName}`);
    const body = encodeURIComponent(
      `Hi,\n\nPlease use the link below to fill in your relocation details and receive your personalized Settlyou guide.\n\nLink: ${joinUrl}\nPIN: ${pin}\n\nThe whole process takes under 5 minutes.\n\nWelcome!\n${clubName}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="bg-brand-600 rounded-xl p-6 mb-8 text-white">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Player Join Link</p>
          <p className="text-sm opacity-90">Share this link and PIN with incoming athletes so they can fill in their relocation details.</p>
        </div>
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity shrink-0 mt-1"
        >
          Preview ↗
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Link field */}
        <div className="flex-1 flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2.5">
          <span className="text-sm font-mono truncate flex-1 opacity-90">{joinUrl}</span>
          <button
            onClick={copyLink}
            className="shrink-0 text-xs font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 transition px-3 py-1 rounded-md"
          >
            {copiedLink ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* PIN field */}
        {pin && (
          <div className="flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-2.5">
            <span className="text-xs uppercase tracking-widest opacity-70 mr-1">PIN</span>
            <span className="text-sm font-mono font-bold tracking-widest">
              {showPin ? pin : "••••"}
            </span>
            <button
              onClick={() => setShowPin(v => !v)}
              className="text-xs opacity-60 hover:opacity-100 transition ml-1"
            >
              {showPin ? "Hide" : "Show"}
            </button>
            <button
              onClick={copyPin}
              className="shrink-0 text-xs font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 transition px-3 py-1 rounded-md ml-1"
            >
              {copiedPin ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        {/* Email button */}
        <button
          onClick={shareByEmail}
          className="shrink-0 bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
        >
          Send via Email
        </button>
      </div>
    </div>
  );
}
