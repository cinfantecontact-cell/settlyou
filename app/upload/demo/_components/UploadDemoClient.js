"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

const COACH_ATTACHMENTS = [
  { id: "1", key: "medical", label: "Medical Clearance Form", file_name: "Medical_Clearance_Template_Soccer.pdf" },
  { id: "2", key: "ncaa-checklist", label: "NCAA Eligibility Checklist", file_name: "NCAA_Eligibility_Checklist.pdf" },
];

const DOCUMENT_TYPES = [
  { key: "passport",    label: "Passport Copy",              required: true,  description: "Photo page of your valid passport." },
  { key: "medical-form",label: "Medical Clearance Form",     required: true,  description: "Download the template above, fill it out, and upload the completed version." },
  { key: "ncaa",        label: "NCAA Eligibility Form",      required: true,  description: "Download the checklist above and upload your signed copy." },
  { key: "transcript",  label: "Official Transcript",        required: true,  description: "Academic transcript from your home institution." },
  { key: "toefl",       label: "English Test (TOEFL/IELTS)", required: false, description: "Only required for non-native English speakers." },
];

// cursor: ref key to animate toward | null
// clicking: brief click animation
// downloaded: coach template keys "downloaded"
// uploading: doc key currently uploading | null
// uploaded: doc keys fully submitted
// showCoach: coach dashboard panel visible
const SEQ = [
  { dur: 1400, cursor: null,          clicking: false, downloaded: [],          uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 800,  cursor: "dl-medical",  clicking: false, downloaded: [],          uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 300,  cursor: "dl-medical",  clicking: true,  downloaded: [],          uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 1500, cursor: "dl-medical",  clicking: false, downloaded: ["medical"], uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 800,  cursor: "ul-passport", clicking: false, downloaded: ["medical"], uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 300,  cursor: "ul-passport", clicking: true,  downloaded: ["medical"], uploading: null,       uploaded: [],                 showCoach: false },
  { dur: 1200, cursor: "ul-passport", clicking: false, downloaded: ["medical"], uploading: "passport", uploaded: [],                 showCoach: false },
  { dur: 1100, cursor: null,          clicking: false, downloaded: ["medical"], uploading: null,       uploaded: ["passport"],        showCoach: false },
  { dur: 800,  cursor: "ul-ncaa",     clicking: false, downloaded: ["medical"], uploading: null,       uploaded: ["passport"],        showCoach: false },
  { dur: 300,  cursor: "ul-ncaa",     clicking: true,  downloaded: ["medical"], uploading: null,       uploaded: ["passport"],        showCoach: false },
  { dur: 1200, cursor: "ul-ncaa",     clicking: false, downloaded: ["medical"], uploading: "ncaa",     uploaded: ["passport"],        showCoach: false },
  { dur: 1100, cursor: null,          clicking: false, downloaded: ["medical"], uploading: null,       uploaded: ["passport","ncaa"], showCoach: false },
  { dur: 4500, cursor: null,          clicking: false, downloaded: ["medical"], uploading: null,       uploaded: ["passport","ncaa"], showCoach: true  },
  { dur: 800,  cursor: null,          clicking: false, downloaded: [],          uploading: null,       uploaded: [],                 showCoach: false },
];

export default function UploadDemoClient() {
  const [step, setStep] = useState(0);
  const timerRef = useRef(null);

  const [cursorXY, setCursorXY] = useState({ x: -300, y: -300 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const buttonRefs = useRef(new Map());
  const registerRef = useCallback((key) => (el) => {
    if (el) buttonRefs.current.set(key, el);
    else buttonRefs.current.delete(key);
  }, []);

  const s = SEQ[step];

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setStep(prev => (prev + 1) % SEQ.length);
    }, s.dur);
    return () => clearTimeout(timerRef.current);
  }, [step, s.dur]);

  useEffect(() => {
    if (isTouchDevice || !s.cursor) { setCursorVisible(false); return; }
    const el = buttonRefs.current.get(s.cursor);
    if (!el) { setCursorVisible(false); return; }
    const rect = el.getBoundingClientRect();
    setCursorXY({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setCursorVisible(true);
  }, [step, s.cursor, isTouchDevice]);

  const required = DOCUMENT_TYPES.filter(d => d.required);
  const optional = DOCUMENT_TYPES.filter(d => !d.required);

  return (
    <div className="relative">

      {/* Cursor — portaled to body to escape backdrop-filter stacking context */}
      {cursorVisible && createPortal(
        <>
          <style>{`
            @keyframes demo-ripple {
              0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.6; }
              100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
            }
            @keyframes demo-hover-ring {
              0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.55; }
              50%       { transform: translate(-50%, -50%) scale(1.35); opacity: 0.2;  }
            }
            @keyframes demo-label-in {
              from { opacity: 0; transform: translateY(3px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
          <div
            className="pointer-events-none fixed z-[9999]"
            style={{
              left: cursorXY.x,
              top: cursorXY.y,
              transition: "left 0.58s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.58s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            {/* Hover ring */}
            {s.cursor && !s.clicking && !s.uploading && (
              <div
                className="absolute rounded-full border-2 border-brand-500"
                style={{ width: 40, height: 40, left: "50%", top: "50%", animation: "demo-hover-ring 1.5s ease-in-out infinite" }}
              />
            )}
            {/* Click ripple */}
            {s.clicking && (
              <div
                className="absolute rounded-full bg-brand-400"
                style={{ width: 48, height: 48, left: "50%", top: "50%", animation: "demo-ripple 0.38s ease-out forwards" }}
              />
            )}
            {/* Cursor SVG */}
            <div style={{
              transform: `translate(-5px, -3px) scale(${s.clicking ? 0.78 : 1})`,
              transition: "transform 0.1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.22)) drop-shadow(0 1px 2px rgba(0,0,0,0.18))",
            }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M7 5L22 14.5L14.5 16L11.5 24L7 5Z" fill="rgba(0,0,0,0.13)" transform="translate(1.8, 2)" />
                <path d="M7 5L22 14.5L14.5 16L11.5 24L7 5Z" fill="white" />
                <path d="M7 5L22 14.5L14.5 16L11.5 24L7 5Z" fill="none" stroke="#0f172a" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            {/* Action label */}
            {s.cursor && (
              <div
                key={s.cursor + String(s.clicking)}
                className="absolute top-0 bg-gray-900/90 text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl"
                style={{ left: 22, animation: "demo-label-in 0.18s ease-out both" }}
              >
                {s.uploading
                  ? "Uploading..."
                  : s.clicking
                  ? s.cursor.startsWith("dl-") ? "Downloading..." : "Uploading..."
                  : s.cursor.startsWith("dl-") ? "Download template" : "Upload document"}
              </div>
            )}
          </div>
        </>,
        document.body
      )}

      <div className="flex flex-col gap-5">

        {/* Status bar */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-xs text-brand-600 font-medium">Alejandro submitting his documents</span>
        </div>

        {/* Coach attachments */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">From your coach</h2>
            <p className="text-xs text-muted mt-0.5">Download these templates, fill them out, then upload your completed versions below.</p>
          </div>
          <div className="divide-y divide-border">
            {COACH_ATTACHMENTS.map(a => {
              const isHighlighted = s.cursor === `dl-${a.key}`;
              const isDownloaded = s.downloaded.includes(a.key);
              return (
                <div key={a.id} className={`px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-200 ${isHighlighted ? "bg-brand-50" : ""}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <svg className="w-4 h-4 text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.label}</p>
                      <p className="text-xs text-muted truncate">{a.file_name}</p>
                    </div>
                  </div>
                  {isDownloaded ? (
                    <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg bg-brand-50 border border-brand-200 text-brand-700">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Downloaded
                    </span>
                  ) : (
                    <button
                      ref={registerRef(`dl-${a.key}`)}
                      disabled
                      className={`shrink-0 text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-150 ${
                        isHighlighted
                          ? "border-brand-500 bg-brand-100 text-brand-700 shadow-lg scale-105"
                          : "border-brand-200 text-brand-700"
                      }`}
                    >
                      Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-border rounded-xl px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted">
              <span className="font-semibold text-foreground">{s.uploaded.length}</span> of {DOCUMENT_TYPES.length} documents submitted
            </p>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${(s.uploaded.length / DOCUMENT_TYPES.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Required docs */}
        <DocSection title="Required documents" docs={required} s={s} registerRef={registerRef} />

        {/* Optional docs */}
        <DocSection title="Optional documents" docs={optional} s={s} registerRef={registerRef} />

      </div>

      {/* Coach dashboard panel */}
      <div
        className={`fixed bottom-6 right-6 z-[9998] transition-all duration-500 ${
          s.showCoach ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden w-72">
          <div className="bg-brand-600 px-5 py-3.5 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-100">Coach Dashboard</p>
              <p className="text-sm font-bold text-white">Men's Soccer</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 bg-white/15 px-2.5 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-bold text-white">Live</span>
            </div>
          </div>
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-foreground mb-1">Alejandro R.</p>
            <p className="text-[10px] text-muted mb-3">2 documents arrived just now</p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Passport Copy",       done: true,  file: "passport_alejandro.pdf" },
                { label: "NCAA Eligibility Form",done: true,  file: "ncaa_alejandro.pdf"     },
                { label: "Medical Clearance",   done: false, note: "Pending"                },
              ].map(d => (
                <div key={d.label} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${d.done ? "bg-brand-50" : "bg-surface"}`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${d.done ? "bg-brand-500" : "border-2 border-border"}`}>
                    {d.done && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${d.done ? "text-brand-700" : "text-muted"}`}>{d.label}</p>
                    {d.done && <p className="text-[10px] text-muted truncate">{d.file}</p>}
                  </div>
                  {d.done
                    ? <span className="text-[10px] font-semibold text-brand-600 shrink-0">Download</span>
                    : <span className="text-[10px] text-muted shrink-0">{d.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocSection({ title, docs, s, registerRef }) {
  if (!docs.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      <div className="divide-y divide-border">
        {docs.map(doc => {
          const refKey = `ul-${doc.key}`;
          const isHighlighted = s.cursor === refKey;
          const isClicking = isHighlighted && s.clicking;
          const isDone = s.uploaded.includes(doc.key);
          const isUploading = s.uploading === doc.key;
          const fileName = isDone ? `${doc.key.replace("-", "_")}_alejandro.pdf` : null;

          return (
            <div key={doc.key} className={`px-6 py-4 flex items-center justify-between gap-4 transition-colors duration-200 ${isHighlighted ? "bg-brand-50" : ""}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${isDone ? "border-brand-500 bg-brand-500" : "border-border bg-white"}`}>
                  {isDone && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate transition-colors ${isDone ? "text-brand-700" : "text-foreground"}`}>{doc.label}</p>
                  {isUploading && <p className="text-xs text-brand-600 mt-0.5 font-medium animate-pulse">Uploading...</p>}
                  {!isDone && !isUploading && <p className="text-xs text-muted mt-0.5">{doc.description}</p>}
                  {isDone && fileName && <p className="text-xs text-muted truncate mt-0.5">{fileName}</p>}
                </div>
              </div>
              <div className="shrink-0">
                {isDone ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-100 text-brand-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Submitted
                  </span>
                ) : (
                  <button
                    ref={registerRef(refKey)}
                    disabled
                    className={`text-xs font-semibold px-4 py-2 rounded-lg border transition-all duration-150 ${
                      isClicking   ? "scale-90 border-brand-500 bg-brand-200 text-brand-700" :
                      isHighlighted? "border-brand-500 bg-brand-100 text-brand-700 shadow-lg scale-105" :
                      isUploading  ? "border-brand-200 text-brand-600 animate-pulse" :
                                     "border-brand-200 text-brand-700"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
