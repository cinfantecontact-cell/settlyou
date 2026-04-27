"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

export default function JoinLinkCard({ slug, pin, clubName, sport }) {
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://settlyou.com";
  const joinUrl = `${baseUrl}/join/${slug}`;

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPin, setCopiedPin] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    QRCode.toDataURL(joinUrl, { width: 256, margin: 2, color: { dark: "#15803d", light: "#ffffff" } }).then(setQrDataUrl).catch(() => {});
  }, [joinUrl]);

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

  function copyInvite() {
    const sportLine = sport ? ` for ${sport}` : "";
    const msg = pin
      ? `Hi,\n\nHere is your Settlyou relocation guide link${sportLine} at ${clubName}:\n\nLink: ${joinUrl}\nPIN: ${pin}\n\nPlease fill in your details (takes under 5 minutes) and you will receive your personalized guide within 24 hours.`
      : `Hi,\n\nHere is your Settlyou relocation guide link${sportLine} at ${clubName}:\n\nLink: ${joinUrl}\n\nPlease fill in your details (takes under 5 minutes) and you will receive your personalized guide within 24 hours.`;
    navigator.clipboard.writeText(msg);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  }

  function copyEmailTemplate() {
    const sportLine = sport ? ` — ${sport}` : "";
    const subject = `Your Settlyou relocation guide — ${clubName}${sportLine}`;
    const sportIntro = sport
      ? `As an incoming ${sport} student-athlete at ${clubName}, we want to make sure your transition to campus is as smooth as possible.`
      : `Welcome to ${clubName}. We are pleased to provide you with a personalized relocation guide to help make your transition as smooth as possible.`;
    const body = `Subject: ${subject}\n\nHi,\n\n${sportIntro}\n\nWe have partnered with Settlyou to generate a guide tailored to your needs, covering:\n\n- Neighborhood and housing recommendations\n- Healthcare, banking, and transportation\n- Campus resources and important contacts\n${sport ? `- ${sport} eligibility and compliance guidance\n` : "- Athletic eligibility guidance (if applicable)\n"}- International student requirements (if applicable)\n\nIt takes under 5 minutes to complete, and your guide will be ready within 24 hours.\n\nJoin link: ${joinUrl}${pin ? `\n\nPlease note: you will be asked to enter a PIN when you access the link. Your PIN will be provided separately.` : ""}\n\nPlease do not hesitate to reach out if you have any questions.\n\nWelcome aboard,\n${clubName}${sport ? ` ${sport}` : ""}`;
    navigator.clipboard.writeText(body);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  return (
    <div className="bg-brand-600 rounded-xl p-6 text-white overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 mb-1">Student Join Link</p>
          <p className="text-sm opacity-90">Share this link and PIN with incoming students so they can fill in their relocation details.</p>
        </div>
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity shrink-0 mt-1"
        >
          Preview
        </a>
      </div>

      {/* Input fields row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        {/* Link field */}
        <div
          className="flex-1 flex items-center gap-2 rounded-lg px-4 py-2.5"
          style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <span className="text-sm font-mono truncate flex-1 text-gray-800">{joinUrl}</span>
          <button
            onClick={copyLink}
            className="shrink-0 text-xs font-semibold text-gray-700 bg-black/10 hover:bg-black/20 transition px-3 py-1 rounded-md"
          >
            {copiedLink ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* PIN field */}
        {pin && (
          <div
            className="flex items-center gap-2 rounded-lg px-4 py-2.5"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <span className="text-xs uppercase tracking-widest text-gray-500 mr-1">PIN</span>
            <span className="text-sm font-mono font-bold tracking-widest text-gray-800">
              {showPin ? pin : "••••"}
            </span>
            <button
              onClick={() => setShowPin(v => !v)}
              className="text-xs text-gray-500 hover:text-gray-800 transition ml-1"
            >
              {showPin ? "Hide" : "Show"}
            </button>
            <button
              onClick={copyPin}
              className="shrink-0 text-xs font-semibold text-gray-700 bg-black/10 hover:bg-black/20 transition px-3 py-1 rounded-md ml-1"
            >
              {copiedPin ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* PIN security tip */}
      {pin && (
        <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.45)" }}>
          Tip: for best security, share the PIN separately from the link (e.g., by phone or in person).
        </p>
      )}

      {/* Action buttons row */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={copyInvite}
          className="shrink-0 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
          style={{ backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.28)"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.18)"}
        >
          {copiedInvite ? "Copied!" : "Copy invite"}
        </button>

        <button
          onClick={copyEmailTemplate}
          className="shrink-0 bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
        >
          {copiedEmail ? "Copied!" : "Copy welcome message"}
        </button>

        {qrDataUrl && (
          <a
            href={qrDataUrl}
            download="join-qr.png"
            className="shrink-0 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
          >
            Download QR Code
          </a>
        )}
      </div>
    </div>
  );
}
