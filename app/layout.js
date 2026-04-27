import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationProgress from "./_components/NavigationProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Settlyou — AI Relocation Software",
  description: "Settlyou gives universities a personalized AI relocation guide for every incoming student.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}
