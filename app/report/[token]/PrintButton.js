"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print text-sm bg-white border border-border text-foreground px-4 py-1.5 rounded-md hover:bg-surface transition-colors font-medium"
    >
      Download PDF
    </button>
  );
}
