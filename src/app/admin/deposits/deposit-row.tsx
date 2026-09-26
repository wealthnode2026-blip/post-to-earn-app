"use client";

import { useTransition } from "react";
import { approveDeposit, rejectDeposit } from "./actions";

type Tx = {
  id: string;
  txid: string;
  amount_usdt: number;
  created_at: string;
  username: string;
};

export function DepositRow({ tx }: { tx: Tx }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-medium text-ink">{tx.username}</p>
        <p className="shrink-0 font-mono text-ink">{tx.amount_usdt} USDT</p>
      </div>

      <a
        href={`https://tronscan.org/#/transaction/${tx.txid}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block truncate font-mono text-xs text-accent underline"
      >
        {tx.txid.slice(0, 14)}...
      </a>

      <div className="mt-3 flex justify-end gap-2">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => approveDeposit(tx.id))}
          className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Approva
        </button>
        <button
          disabled={isPending}
          onClick={() => {
            const note = prompt("Motivo del rifiuto (opzionale):") ?? "";
            startTransition(() => rejectDeposit(tx.id, note));
          }}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-pearl disabled:opacity-40"
        >
          Rifiuta
        </button>
      </div>
    </div>
  );
}
