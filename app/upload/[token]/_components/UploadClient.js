"use client";

import { useState } from "react";

export default function UploadClient({ token, documentTypes, initialSubmitted }) {
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const submittedKeys = new Set(submitted.map(s => s.document_type));

  async function handleUpload(docKey, file) {
    if (!file) return;
    setUploading(u => ({ ...u, [docKey]: true }));
    setErrors(e => ({ ...e, [docKey]: null }));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docKey);

    const res = await fetch(`/api/upload/${token}/submit`, {
      method: "POST",
      body: formData,
    });

    setUploading(u => ({ ...u, [docKey]: false }));

    if (!res.ok) {
      const data = await res.json();
      setErrors(e => ({ ...e, [docKey]: data.error ?? "Upload failed. Please try again." }));
      return;
    }

    setSubmitted(prev => [
      ...prev,
      { document_type: docKey, file_name: file.name, uploaded_at: new Date().toISOString() },
    ]);
  }

  const required = documentTypes.filter(d => d.required);
  const optional = documentTypes.filter(d => !d.required);
  const doneCount = documentTypes.filter(d => submittedKeys.has(d.key)).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="bg-white border border-border rounded-xl px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{doneCount}</span> of {documentTypes.length} documents submitted
        </p>
        {doneCount === documentTypes.length && (
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
            All done
          </span>
        )}
      </div>

      {/* Required */}
      <Section title="Required documents" docs={required} submittedKeys={submittedKeys} submitted={submitted} uploading={uploading} errors={errors} onUpload={handleUpload} />

      {/* Optional */}
      {optional.length > 0 && (
        <Section title="Optional documents" docs={optional} submittedKeys={submittedKeys} submitted={submitted} uploading={uploading} errors={errors} onUpload={handleUpload} />
      )}

      <p className="text-xs text-muted text-center pb-6">
        Bookmark this page to come back and upload more documents anytime.
      </p>
    </div>
  );
}

function Section({ title, docs, submittedKeys, submitted, uploading, errors, onUpload }) {
  if (!docs.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {docs.map(doc => {
          const isDone = submittedKeys.has(doc.key);
          const sub = submitted.find(s => s.document_type === doc.key);
          const isUploading = uploading[doc.key];
          const err = errors[doc.key];

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
                  {isDone && sub && (
                    <p className="text-xs text-muted truncate">{sub.file_name}</p>
                  )}
                  {err && <p className="text-xs text-red-600 mt-0.5">{err}</p>}
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
