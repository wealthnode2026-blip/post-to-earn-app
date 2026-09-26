"use client";

import { useState, useTransition } from "react";
import { generateWeeklyDuels, closeWeekAndCrownWinner } from "./actions";

export function WeekControls() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function run(action: () => Promise<void>, confirmText?: string) {
    if (confirmText && !confirm(confirmText)) return;
    setMessage(null);
    startTransition(() =>
      action()
        .then(() => setMessage("Fatto."))
        .catch((err: Error) => setMessage(err.message))
    );
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface p-4">
      <button
        disabled={isPending}
        onClick={() => run(generateWeeklyDuels)}
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
      >
        Genera duelli della settimana
      </button>
      <button
        disabled={isPending}
        onClick={() =>
          run(
            closeWeekAndCrownWinner,
            "Questo chiude la settimana, incorona la foto vincitrice e cancella definitivamente tutte le altre foto della settimana. Procedere?"
          )
        }
        className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft hover:bg-pearl disabled:opacity-40"
      >
        Chiudi settimana e assegna vincitore
      </button>
      {message && <span className="text-sm text-ink-soft">{message}</span>}
    </div>
  );
}
