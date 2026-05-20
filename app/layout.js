import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationProgress from "./_components/NavigationProgress";
import PwaRedirect from "./_components/PwaRedirect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Settlyou — Welcome them better",
  description: "Welcome them better. Settlyou gives every incoming athlete a personalized AI relocation guide — in under 5 minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <PwaRedirect />
        <NavigationProgress />
        {children}
      </body>
    </html>
  );
}
