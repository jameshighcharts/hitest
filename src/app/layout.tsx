import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HiTest Platform",
  description: "Self-hosted usability testing for GitHub demos and Prolific",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
