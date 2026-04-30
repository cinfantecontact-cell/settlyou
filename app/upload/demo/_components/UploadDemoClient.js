"use client";

import { useState } from "react";

const COACH_ATTACHMENTS = [
  {
    id: "1",
    label: "Medical Clearance Form",
    file_name: "Medical_Clearance_Template_Soccer.pdf",
  },
  {
    id: "2",
    label: "NCAA Eligibility Checklist",
    file_name: "NCAA_Eligibility_Checklist.pdf",
  },
];

const DOCUMENT_TYPES = [
  { key: "passport", label: "Passport Copy", required: true, description: "Photo page of your valid passport." },
  { key: "medical", label: "Medical Clearance Form", required: true, description: "Download the template above, fill it out, and upload the completed version." },
  { key: "ncaa", label: "NCAA Eligibility Form", required: true, description: "Download the checklist above and upload your signed copy." },
  { key: "transcript", label: "Official Transcript", required: true, description: "Academic transcript from your home institution." },
  { key: "toefl", label: "English Test (TOEFL/IELTS)", required: false, description: "Only required for non-native English speakers." },
];

export default function UploadDemoClient() {
  const [submitted, setSubmitted] = useState({});
  const [uploading, setUploading] = useState({});

  async function handleUpload(docKey, file) {
    if (!file) return;
    setUploading(u => ({ ...u, [docKey]: true }));
    // Simulate upload delay
    await new Promise(r => setTimeout(r, 900));
    setUploading(u => ({ ...u, [docKey]: false }));
    setSubmitted(s => ({ ...s, [docKey]: file.name }));
  }

  const required = DOCUMENT_TYPES.filter(d => d.required);
  const optional = DOCUMENT_TYPES.filter(d => !d.required);
  const doneCount = Object.keys(submitted).length;
  const total = DOCUMENT_TYPES.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Demo banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-amber-700 font-medium">This is a demo — no files are stored. Try uploading any file to see how it works.</p>
      </div>

      {/* Coach attachments */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">From your coach</h2>
          <p className="text-xs text-muted mt-0.5">Download these templates, fill them out, then upload your completed version below.</p>
        </div>
        <div className="divide-y divide-border">
          {COACH_ATTACHMENTS.map(a => (
            <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                  <p className="text-xs text-muted truncate">{a.file_name}</p>
                </div>
              </div>
              <button
                onClick={() => alert("In the live product, this downloads the coach's template file.")}
                className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-border rounded-xl px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{doneCount}</span> of {total} documents submitted
        </p>
        {doneCount === total && (
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
            All done
          </span>
        )}
      </div>

      {/* Required */}
      <DemoSection title="Required documents" docs={required} submitted={submitted} uploading={uploading} onUpload={handleUpload} />

      {/* Optional */}
      <DemoSection title="Optional documents" docs={optional} submitted={submitted} uploading={uploading} onUpload={handleUpload} />

      <p className="text-xs text-muted text-center pb-6">
        Bookmark this page to come back and upload more documents anytime.
      </p>
    </div>
  );
}

function DemoSection({ title, docs, submitted, uploading, onUpload }) {
  if (!docs.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {docs.map(doc => {
          const isDone = !!submitted[doc.key];
          const isUploading = uploading[doc.key];

          return (
            <div key={doc.key} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isDone ? "border-brand-500 bg-brand-500" : "border-border bg-white"
                }`}>
                  {isDone && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isDone ? "text-brand-700" : "text-foreground"}`}>
                    {doc.label}
                  </p>
                  {!isDone && doc.description && (
                    <p className="text-xs text-muted mt-0.5">{doc.description}</p>
                  )}
                  {isDone && (
                    <p className="text-xs text-muted truncate">{submitted[doc.key]}</p>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <label className="cursor-pointer text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted hover:text-foreground transition-colors">
                    Replace
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={e => e.target.files?.[0] && onUpload(doc.key, e.target.files[0])}
                    />
                  </label>
                ) : (
                  <label className={`cursor-pointer text-xs font-semibold px-4 py-2 rounded-lg border transition-colors ${
                    isUploading
                      ? "border-border text-muted opacity-50 cursor-not-allowed"
                      : "border-brand-200 text-brand-700 hover:bg-brand-50"
                  }`}>
                    {isUploading ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      className="sr-only"
                      disabled={isUploading}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={e => e.target.files?.[0] && onUpload(doc.key, e.target.files[0])}
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
