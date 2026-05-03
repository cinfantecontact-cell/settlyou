"use client";

import { useState, useRef, useEffect } from "react";

const ADMIN_SUGGESTIONS = [
  "How do I share the join link with students?",
  "Where do I upload documents for guides?",
  "What does 'Quality Check' mean?",
];

const COACH_SUGGESTIONS = [
  "How do I read the document progress bar on a student's profile?",
  "How do I add notes and links to my athletes' guides?",
  "Where do I see which documents each athlete has uploaded?",
];

export default function PortalAssistant({ role }) {
  const SUGGESTIONS = role === "coach" ? COACH_SUGGESTIONS : ADMIN_SUGGESTIONS;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Restore state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("settl_assistant");
      if (saved) {
        const { open: savedOpen, messages: savedMessages } = JSON.parse(saved);
        if (savedOpen) setOpen(true);
        if (savedMessages?.length) setMessages(savedMessages);
      }
    } catch {}
  }, []);

  // Persist state to sessionStorage on every change
  useEffect(() => {
    try {
      sessionStorage.setItem("settl_assistant", JSON.stringify({ open, messages }));
    } catch {}
  }, [open, messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/club/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, role }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 bg-white border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: "440px" }}>
          {/* Header */}
          <div className="bg-brand-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-300" />
              <span className="text-sm font-semibold text-white">Ask Settlyou</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-0">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3 pt-2">
                <p className="text-xs text-muted text-center">Ask me anything about the portal.</p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs text-left px-3 py-2 rounded-lg border border-brand-100 text-brand-700 hover:bg-brand-50 transition-colors leading-snug"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`text-sm px-3 py-2 rounded-xl leading-relaxed max-w-[88%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-sm"
                      : "bg-surface text-foreground rounded-bl-sm border border-border"
                  }`}>
                    {m.content || <span className="opacity-40">...</span>}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-border shrink-0 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Ask a question..."
              disabled={loading}
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted disabled:opacity-50 min-w-0"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className="shrink-0 text-brand-600 hover:text-brand-700 transition-colors disabled:opacity-30"
              aria-label="Send"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        id="tour-assistant-btn"
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        title="Ask Settlyou"
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </>
  );
}
