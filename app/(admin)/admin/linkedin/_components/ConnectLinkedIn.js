"use client";

export default function ConnectLinkedIn({ connected }) {
  if (connected) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium text-green-700">LinkedIn connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-amber-800">LinkedIn not connected</p>
        <p className="text-xs text-amber-600 mt-0.5">
          Posts will be saved as drafts. Connect your LinkedIn Company Page to enable auto-publishing.
        </p>
      </div>
      <a
        href="/api/admin/linkedin/connect"
        className="text-xs font-semibold px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 transition-colors shrink-0"
      >
        Connect LinkedIn
      </a>
    </div>
  );
}
