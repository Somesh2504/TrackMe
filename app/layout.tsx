import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrackMe | Gym Weight Tracker",
  description:
    "Log workouts, track weights, and see your strength progress with TrackMe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(236,72,153,0.12),transparent_30%)]" />
        <div className="min-h-screen relative">{children}</div>
      </body>
    </html>
  );
}
