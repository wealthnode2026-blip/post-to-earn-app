import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atelier — Post-to-Earn",
  description: "Una foto al giorno. Un'arena settimanale. Un solo scatto conta.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-pearl text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
