const STATUS_MAP = {
  submitted:    { label: "Received",        class: "bg-blue-50 text-blue-700",    title: "Received — guide being generated" },
  generating:   { label: "Generating",      class: "bg-yellow-50 text-yellow-700", title: "In progress — guide ready within minutes" },
  under_review: { label: "Generating",      class: "bg-yellow-50 text-yellow-700", title: "In progress — guide ready within minutes" },
  delivered:    { label: "Sent to Student", class: "bg-brand-50 text-brand-700",  title: null },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, class: "bg-surface text-muted", title: null };
  return (
    <span
      title={s.title || undefined}
      className={`text-xs font-medium px-2 py-1 rounded-full ${s.class}`}
    >
      {s.label}
    </span>
  );
}
