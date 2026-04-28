"use client";

import { useState } from "react";

function QuoteModal({ onClose }) {
  const [form, setForm] = useState({ institution: "", name: "", email: "", role: "", volume: "", message: "" });
  const [status, setStatus] = useState("idle");

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-brand-600 px-8 py-6">
          <button onClick={onClose} className="absolute top-4 right-5 text-white/60 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <p className="text-xs font-bold uppercase tracking-widest text-brand-200 mb-1">Get a quote</p>
          <h2 className="text-xl font-bold text-white">Tell us about your program</h2>
          <p className="text-sm text-brand-100 mt-1">We'll send custom pricing within one business day.</p>
        </div>
        <div className="px-8 py-6">
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-bold mb-2">We got your request!</p>
              <p className="text-sm text-gray-500">We'll reach out to {form.email} within one business day.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 transition-colors">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Institution name *</label>
                  <input required value={form.institution} onChange={set("institution")} placeholder="Florida Atlantic University"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Your name *</label>
                  <input required value={form.name} onChange={set("name")} placeholder="Alex Johnson"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Work email *</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="alex@university.edu"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold">Your role</label>
                  <input value={form.role} onChange={set("role")} placeholder="Athletics Director, Coach…"
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Estimated athletes per year</label>
                <select value={form.volume} onChange={set("volume")}
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                  <option value="">— Select a range —</option>
                  <option value="Under 40">Under 40 (Micro)</option>
                  <option value="40–100">40 – 100 (Starter)</option>
                  <option value="100–200">100 – 200 (Pro)</option>
                  <option value="200+">200+ (Institution)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Anything else?</label>
                <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Sports programs, specific questions…"
                  className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
              </div>
              {status === "error" && (
                <p className="text-xs text-red-600">Something went wrong — please try again or email hello@settlyou.com.</p>
              )}
              <button type="submit" disabled={status === "sending"}
                className="bg-brand-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 mt-1">
                {status === "sending" ? "Sending…" : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuoteButton({ className, children }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && <QuoteModal onClose={() => setShowModal(false)} />}
      <button onClick={() => setShowModal(true)} className={className}>
        {children}
      </button>
    </>
  );
}
