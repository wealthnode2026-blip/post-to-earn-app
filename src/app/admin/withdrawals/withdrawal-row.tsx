"use client";

import { useTransition } from "react";
import { approveWithdrawal, rejectWithdrawal } from "./actions";

type Req = {
  id: string;
  amount_usdt: number;
  wallet_address: string;
  created_at: string;
  username: string;
};

export function WithdrawalRow({ req }: { req: Req }) {
  const [isPending, startTransition] = useTransition();

  function handleCopy() {
    navigator.clipboard.writeText(req.wallet_address);
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-medium text-ink">{req.username}</p>
        <p className="shrink-0 font-mono text-ink">{req.amount_usdt} USDT</p>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 block truncate font-mono text-xs text-accent underline"
        title="Clicca per copiare"
      >
        {req.wallet_address}
      </button>

      <div className="mt-3 flex justify-end gap-2">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              if (
                !confirm(
                  "Conferma solo dopo aver inviato manualmente gli USDT a questo indirizzo. Procedere?"
                )
              )
                return;
              await approveWithdrawal(req.id);
            })
          }
          className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Segna come pagato
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            const note = prompt("Motivo del rifiuto (opzionale):") ?? "";
            startTransition(() => rejectWithdrawal(req.id, note));
          }}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-pearl disabled:opacity-40"
        >
          Rifiuta (restituisci crediti)
        </button>
      </div>
    </div>
  );
}
