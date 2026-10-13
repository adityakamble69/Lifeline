import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lifeline — Blood Donor Network",
  description: "Connect blood donors, requesters, and donation camps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen overflow-x-hidden bg-background font-sans text-text-primary antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}