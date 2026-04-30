import UploadDemoClient from "./_components/UploadDemoClient";

export const metadata = {
  title: "Document Upload — Settlyou Demo",
  robots: { index: false, follow: false },
};

export default function UploadDemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <img src="/settlyou-logo-dark.png" alt="Settlyou" className="h-7 mb-8" />
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Hi Carlos,
          </h1>
          <p className="text-sm text-muted">
            Upload your documents for <strong>State University</strong> below. You can come back to this page anytime to add more.
          </p>
        </div>

        <UploadDemoClient />
      </div>
    </div>
  );
}
