"use client";

import { useState, useTransition } from "react";
import { updateDuelPrize } from "./actions";

export function PrizeForm({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(() =>
      updateDuelPrize(value)
        .then(() => setMessage("Premio aggiornato."))
        .catch((err: Error) => setMessage(err.message))
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-4"
    >
      <label className="text-sm text-ink-soft" htmlFor="prize-input">
        Premio in palio questa settimana
      </label>
      <input
        id="prize-input"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 min-w-[200px] rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
        placeholder="Es. 500 crediti extra al vincitore"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
      >
        Salva
      </button>
      {message && <span className="text-sm text-ink-soft">{message}</span>}
    </form>
  );
}
