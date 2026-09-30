"use client";

import { useTransition } from "react";
import { approveWithdrawal, rejectWithdrawal } from "./actions";
import { networkLabel as getNetworkLabel, addressExplorerUrl } from "@/lib/networks";

type Req = {
  id: string;
  amount_usdt: number;
  wallet_address: string;
  network: string;
  created_at: string;
  username: string;
};

export function WithdrawalRow({ req }: { req: Req }) {
  const [isPending, startTransition] = useTransition();
  const networkLabel = getNetworkLabel(req.network);
  const isBtc = req.network === "BTC";

  function handleCopy() {
    navigator.clipboard.writeText(req.wallet_address);
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-medium text-ink">{req.username}</p>
        <p className="shrink-0 font-mono text-ink">{req.amount_usdt} USDT</p>
      </div>

      <p className="mt-1 text-xs font-medium text-ink">
        Rete: {networkLabel}
        {isBtc && (
          <span className="ml-2 font-normal text-gold-ink">
            da pagare in BTC al controvalore di {req.amount_usdt} USDT
          </span>
        )}
      </p>

      <button
        type="button"
        onClick={handleCopy}
        className="mt-2 block max-w-full break-all text-left font-mono text-xs text-accent underline"
        title="Clicca per copiare"
      >
        {req.wallet_address}
      </button>
      <a
        href={addressExplorerUrl(req.network, req.wallet_address)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block text-xs text-ink-soft underline"
      >
        Vedi indirizzo sull&apos;explorer
      </a>

      <div className="mt-3 flex justify-end gap-2">
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              if (
                !confirm(
                  `Conferma solo dopo aver inviato manualmente ${isBtc ? "i BTC" : "gli USDT"} a questo indirizzo sulla rete ${networkLabel}. Procedere?`
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
