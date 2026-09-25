import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import { AppProvider } from "@/components/providers";
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

// Prevent flash of wrong theme before React hydrates.
const themeInitScript = `
(function() {
  try {
    var raw = localStorage.getItem('lifeline.app.settings');
    var s = raw ? JSON.parse(raw) : {};
    var theme = s.theme || 'light';
    var color = s.primaryColor || 'red';
    var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) document.documentElement.classList.add('dark');
    document.documentElement.dataset.color = color;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="min-h-screen overflow-x-hidden bg-background font-sans text-text-primary antialiased">
          <Script id="theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          <AppProvider>{children}</AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}