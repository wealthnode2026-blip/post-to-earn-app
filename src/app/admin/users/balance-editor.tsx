"use client";

import { useState, useTransition } from "react";
import { setUserBalance } from "./actions";

export function BalanceEditor({ userId, currentBalance }: { userId: string; currentBalance: number }) {
  const [value, setValue] = useState(currentBalance.toString());
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSave() {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed < 0) {
      setError("Valore non valido");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await setUserBalance(userId, parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-24 rounded-lg border border-line bg-pearl px-2 py-1 text-sm text-ink"
      />
      <button
        disabled={isPending}
        onClick={handleSave}
        className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {isPending ? "Salvo…" : "Salva"}
      </button>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
