"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "pending",     label: "Pending",     class: "bg-yellow-100 text-yellow-800" },
  { value: "contacted",   label: "Contacted",   class: "bg-blue-100 text-blue-800" },
  { value: "deal_closed", label: "Deal closed", class: "bg-brand-100 text-brand-800" },
  { value: "rejected",    label: "Rejected",    class: "bg-red-100 text-red-800" },
];

export default function LeadStatusSelect({ leadId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus || "pending");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const current = OPTIONS.find(o => o.value === status) ?? OPTIONS[0];

  async function handleChange(e) {
    const next = e.target.value;
    setSaving(true);
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setStatus(next);
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="relative inline-flex">
      <select
        value={status}
        onChange={handleChange}
        disabled={saving}
        className={`appearance-none text-xs font-medium px-2.5 py-1 rounded-full pr-6 cursor-pointer border-0 outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 ${current.class}`}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
