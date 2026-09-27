import type { Metadata, Viewport } from "next";
import "./globals.css";
import PageViewTracker from "./components/page-view-tracker";

export const metadata: Metadata = {
  title: "Atelier — Post-to-Earn",
  description: "Una foto al giorno. Un'arena settimanale. Un solo scatto conta.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atelier",
  },
};

export const viewport: Viewport = {
  themeColor: "#150c26",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-pearl text-ink font-sans">
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}
