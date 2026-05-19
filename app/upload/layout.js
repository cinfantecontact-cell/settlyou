import SwRegister from "./_components/SwRegister";

export const metadata = {
  title: "Settlyou — Upload Documents",
  description: "Upload your documents securely for your college team.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Settlyou",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport = {
  themeColor: "#3e9b3e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function UploadLayout({ children }) {
  return (
    <>
      <SwRegister />
      {children}
    </>
  );
}
