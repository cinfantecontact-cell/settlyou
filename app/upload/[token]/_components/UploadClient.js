"use client";

import { useState, useEffect, useRef } from "react";

export default function UploadClient({ token, documentTypes, initialSubmitted, coachAttachments = [], formQuestions = [], initialResponses = [] }) {
  const [submitted, setSubmitted] = useState(initialSubmitted);
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  // Form question responses: { [question_id]: answer }
  const [responses, setResponses] = useState(() =>
    Object.fromEntries(initialResponses.map(r => [r.question_id, r.answer]))
  );
  const [savedResponses, setSavedResponses] = useState(() =>
    new Set(initialResponses.filter(r => r.answer).map(r => r.question_id))
  );

  // Install prompt
  const [installPrompt, setInstallPrompt] = useState(null); // "android" | "ios" | null
  const deferredInstall = useRef(null);
  const hasShownPrompt = useRef(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredInstall.current = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function triggerInstallPrompt() {
    if (hasShownPrompt.current) return;
    hasShownPrompt.current = true;
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isInStandalone) return; // already installed
    if (deferredInstall.current) {
      setInstallPrompt("android");
    } else if (isIos) {
      setInstallPrompt("ios");
    }
  }

  async function handleNativeInstall() {
    if (!deferredInstall.current) return;
    deferredInstall.current.prompt();
    const { outcome } = await deferredInstall.current.userChoice;
    deferredInstall.current = null;
    if (outcome === "accepted") setInstallPrompt(null);
  }

  async function handleResponseSave(questionId, value) {
    const res = await fetch(`/api/upload/${token}/form-response`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, answer: value }),
    });
    if (res.ok && value) {
      setSavedResponses(prev => new Set([...prev, questionId]));
    }
  }

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

    const newSubmitted = [
      ...submitted,
      { document_type: docKey, file_name: file.name, uploaded_at: new Date().toISOString() },
    ];
    setSubmitted(newSubmitted);

    // Show install prompt after first successful upload
    if (newSubmitted.length === 1) {
      setTimeout(triggerInstallPrompt, 1200);
    }
  }

  const required = documentTypes.filter(d => d.required);
  const optional = documentTypes.filter(d => !d.required);
  const doneCount = documentTypes.filter(d => submittedKeys.has(d.key)).length;
  const allDone = doneCount === documentTypes.length && documentTypes.length > 0;
  const progressPct = documentTypes.length ? Math.round((doneCount / documentTypes.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Progress bar */}
      <div className="bg-white border border-border rounded-xl px-5 py-4">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{doneCount}</span> of {documentTypes.length} documents submitted
          </p>
          {allDone && (
            <span className="text-xs font-semibold text-brand-600 bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
              All done
            </span>
          )}
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl px-5 py-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-800">You're all set!</p>
            <p className="text-xs text-brand-700 mt-0.5">Your documents have been submitted. Your team will review them shortly.</p>
          </div>
        </div>
      )}

      {/* Attachments from team */}
      {coachAttachments.length > 0 && (
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">From your team</h2>
            <p className="text-xs text-muted mt-0.5">Download, fill out, then upload below.</p>
          </div>
          <div className="divide-y divide-border">
            {coachAttachments.map(a => (
              <div key={a.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                      {a.source === "coach" && (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">Coach</span>
                      )}
                      {a.source === "admissions" && (
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700">Admissions</span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate">{a.file_name}</p>
                  </div>
                </div>
                <a href={a.url} target="_blank" rel="noopener noreferrer"
                  className="shrink-0 min-h-[44px] flex items-center text-xs font-semibold px-4 py-2 rounded-lg border border-brand-200 text-brand-700 hover:bg-brand-50 active:bg-brand-100 transition-colors">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required */}
      <Section title="Required documents" docs={required} submittedKeys={submittedKeys} submitted={submitted} uploading={uploading} errors={errors} onUpload={handleUpload} />

      {/* Optional */}
      {optional.length > 0 && (
        <Section title="Optional documents" docs={optional} submittedKeys={submittedKeys} submitted={submitted} uploading={uploading} errors={errors} onUpload={handleUpload} />
      )}

      {/* Form questions */}
      {formQuestions.length > 0 && (() => {
        const groups = [];
        const seen = new Map();
        for (const q of formQuestions) {
          const key = q.templateName ?? "__general__";
          if (!seen.has(key)) {
            seen.set(key, groups.length);
            groups.push({ name: q.templateName ?? null, source: q.source, questions: [] });
          }
          groups[seen.get(key)].questions.push(q);
        }
        return (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-foreground">Questions for you</h2>
              <p className="text-xs text-muted mt-0.5">Your answers save automatically.</p>
            </div>
            {groups.map(group => (
              <div key={group.name ?? "__general__"}>
                <div className="px-5 py-2.5 bg-surface border-b border-border flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{group.name ?? "General"}</span>
                  {group.source === "coach" && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">Coach</span>
                  )}
                  {group.source === "admissions" && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700">Admissions</span>
                  )}
                  {group.source === "both" && (
                    <>
                      <span className="text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700">Coach</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700">Admissions</span>
                    </>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {group.questions.map(q => {
                    const answered = savedResponses.has(q.id);
                    return (
                      <div key={q.id} className="px-5 py-4 flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          answered ? "border-brand-500 bg-brand-500" : "border-border bg-white"
                        }`}>
                          {answered && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <p className="text-sm font-medium text-foreground">{q.label}</p>
                            {q.source === "coach" && !group.source && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full border border-blue-100 bg-blue-50 text-blue-700 shrink-0">Coach</span>
                            )}
                            {q.source === "admissions" && !group.source && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 shrink-0">Admissions</span>
                            )}
                            {q.required && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full border border-brand-100 bg-brand-50 text-brand-700 shrink-0">required</span>
                            )}
                          </div>
                          {q.type === "select" ? (
                            <select
                              value={responses[q.id] ?? ""}
                              onChange={e => {
                                const val = e.target.value;
                                setResponses(prev => ({ ...prev, [q.id]: val }));
                                handleResponseSave(q.id, val);
                              }}
                              className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                            >
                              <option value="">Select an option...</option>
                              {(q.options || []).map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={responses[q.id] ?? ""}
                              onChange={e => setResponses(prev => ({ ...prev, [q.id]: e.target.value }))}
                              onBlur={e => handleResponseSave(q.id, e.target.value)}
                              placeholder="Your answer..."
                              className="w-full border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <p className="text-xs text-muted text-center pb-4">
        Bookmark this page to come back anytime.
      </p>

      {/* Install prompt — bottom sheet */}
      {installPrompt && (
        <InstallSheet
          type={installPrompt}
          onInstall={handleNativeInstall}
          onDismiss={() => setInstallPrompt(null)}
        />
      )}
    </div>
  );
}

function Section({ title, docs, submittedKeys, submitted, uploading, errors, onUpload }) {
  if (!docs.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {docs.map(doc => {
          const isDone = submittedKeys.has(doc.key);
          const sub = submitted.find(s => s.document_type === doc.key);
          const isUploading = uploading[doc.key];
          const err = errors[doc.key];

          const sourceBorder =
            doc.source === "admissions" ? "border-l-4 border-l-orange-400" :
            "border-l-4 border-l-blue-400";

          return (
            <div key={doc.key} className={`px-5 py-4 flex items-center justify-between gap-4 ${sourceBorder}`}>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-medium truncate ${isDone ? "text-brand-700" : "text-foreground"}`}>
                      {doc.label}
                    </p>
                    {doc.source === "admissions" && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700">admissions</span>
                    )}
                    {doc.source === "coach" && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700">coach</span>
                    )}
                    {doc.source === "both" && (
                      <>
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700">coach</span>
                        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700">admissions</span>
                      </>
                    )}
                  </div>
                  {!isDone && doc.description && (
                    <p className="text-xs text-muted mt-0.5">{doc.description}</p>
                  )}
                  {isDone && sub && (
                    <p className="text-xs text-muted truncate">{sub.file_name}</p>
                  )}
                  {err && <p className="text-xs text-red-600 mt-0.5">{err}</p>}
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <label className="cursor-pointer min-h-[44px] flex items-center text-xs font-medium px-4 py-2 rounded-lg border border-border text-muted hover:text-foreground active:bg-surface transition-colors">
                    Replace
                    <input
                      type="file"
                      className="sr-only"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*"
                      onChange={e => e.target.files?.[0] && onUpload(doc.key, e.target.files[0])}
                    />
                  </label>
                ) : (
                  <label className={`cursor-pointer min-h-[44px] flex items-center text-sm font-semibold px-5 py-2.5 rounded-xl border transition-colors ${
                    isUploading
                      ? "border-border text-muted opacity-50 cursor-not-allowed"
                      : "border-brand-200 text-brand-700 hover:bg-brand-50 active:bg-brand-100"
                  }`}>
                    {isUploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                        Uploading
                      </span>
                    ) : "Upload"}
                    <input
                      type="file"
                      className="sr-only"
                      disabled={isUploading}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,image/*"
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

function InstallSheet({ type, onInstall, onDismiss }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onDismiss}
      />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl px-6 pt-5 pb-8">
        {/* Handle */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shrink-0">
            <img src="/apple-touch-icon.png" alt="" className="w-10 h-10 rounded-xl" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Add to Home Screen</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              Save Settlyou to your home screen so you can come back easily to upload more documents.
            </p>
          </div>
        </div>

        {type === "android" ? (
          <button
            onClick={onInstall}
            className="w-full min-h-[48px] bg-brand-500 text-white font-semibold text-sm rounded-xl border border-brand-600 hover:bg-brand-600 active:bg-brand-700 transition-colors"
          >
            Add to Home Screen
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-surface rounded-xl px-4 py-3 space-y-2.5">
              <Step n={1} text='Tap the Share button in Safari' icon={<ShareIcon />} />
              <Step n={2} text='Scroll down and tap "Add to Home Screen"' icon={<PlusSquareIcon />} />
              <Step n={3} text='Tap "Add" to confirm' icon={<CheckIcon />} />
            </div>
          </div>
        )}

        <button
          onClick={onDismiss}
          className="w-full mt-3 min-h-[44px] text-sm text-muted font-medium"
        >
          Not now
        </button>
      </div>
    </>
  );
}

function Step({ n, text, icon }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
        {n}
      </div>
      <p className="text-xs text-foreground flex-1">{text}</p>
      <div className="text-muted shrink-0">{icon}</div>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function PlusSquareIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
