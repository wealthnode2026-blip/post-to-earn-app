"use client";

import { useState, useTransition } from "react";
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
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3 text-ink">{tx.username}</td>
      <td className="px-4 py-3 text-ink">{tx.amount_usdt} USDT</td>
      <td className="px-4 py-3">
        <a
          href={`https://tronscan.org/#/transaction/${tx.txid}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-accent underline"
        >
          {tx.txid.slice(0, 14)}...
        </a>
      </td>
      <td className="px-4 py-3 text-right space-x-2">
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
      </td>
     </tr>
  );
}
