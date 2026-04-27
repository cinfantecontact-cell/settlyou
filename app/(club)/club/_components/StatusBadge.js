const STATUS_MAP = {
  submitted:    { label: "Received",       class: "bg-blue-50 text-blue-700",    title: "Received — guide usually ready within 24 hours" },
  generating:   { label: "Generating",     class: "bg-yellow-50 text-yellow-700", title: "In progress — usually ready within 24 hours" },
  under_review: { label: "Quality Check",  class: "bg-orange-50 text-orange-700", title: "Being reviewed — almost ready" },
  approved:     { label: "Ready to Send",  class: "bg-green-50 text-green-700",   title: "Approved — being sent to the student" },
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
