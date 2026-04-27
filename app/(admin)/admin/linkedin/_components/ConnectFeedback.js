"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ERROR_MESSAGES = {
  no_client_id: "LinkedIn app is not configured (missing client ID).",
  no_code: "LinkedIn did not return an authorization code. Try again.",
  token_exchange: "Failed to exchange the authorization code. Check your LinkedIn app credentials.",
  db_save: "Connected to LinkedIn but failed to save the token. Try again.",
  state_mismatch: "Security check failed. Please try connecting again.",
};

export default function ConnectFeedback({ connected, error }) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!connected && !error) return;
    if (connected) {
      const t = setTimeout(() => {
        setVisible(false);
        router.replace("/admin/linkedin");
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [connected, error, router]);

  if (!visible || (!connected && !error)) return null;

  if (connected) {
    return (
      <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
        <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium text-green-700">LinkedIn connected successfully!</span>
      </div>
    );
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-red-700">
          {ERROR_MESSAGES[error] ?? "Connection failed. Please try again."}
        </span>
      </div>
      <button
        onClick={() => { setVisible(false); router.replace("/admin/linkedin"); }}
        className="text-red-400 hover:text-red-600 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
