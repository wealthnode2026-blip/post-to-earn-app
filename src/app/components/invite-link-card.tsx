"use client";

import { useState } from "react";
import Link from "next/link";

export function InviteLinkCard({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const link = `${window.location.origin}/signup?ref=${encodeURIComponent(username)}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // copia non riuscita, nessuna azione ulteriore
    }
  }

  return (
    <div className="mb-6 rounded-lg border border-line bg-surface px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink">Invita un amico</p>
          <p className="text-xs text-ink-soft">
            Ricevi 0.25 USDT quando compra il primo rullino
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-accent/20 bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-ink"
        >
          {copied ? "Copiato!" : "Copia link"}
        </button>
      </div>
      <Link href="/friends" className="mt-2 inline-block text-xs font-medium text-accent">
        I tuoi amici invitati →
      </Link>
    </div>
  );
}
