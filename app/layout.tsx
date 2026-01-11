import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AdminNav } from "@/components/AdminNav";
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
  title: "Admin Portal | Kalpavruksha EduHub",
  description: "Administrative portal for managing Kalpavruksha resources.",
  icons: {
    icon: '/kalpa-tree.png',
    apple: '/kalpa-tree.png',
    shortcut: '/kalpa-tree.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AdminNav />
        <div className="pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
