"use client";

import { useRef, useState, useTransition } from "react";
import { submitDeposit } from "./actions";

const DEPOSIT_ADDRESS = "TR9ExKDA6ytvuFrDXKNqcRjUrcvRXYiVE1";

export function DepositForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  function handleCopy() {
    navigator.clipboard.writeText(DEPOSIT_ADDRESS).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gold/20 bg-gold-soft p-5">
        <p className="text-xs font-medium text-gold-ink">
          Indirizzo di deposito — rete USDT TRC-20 (TRON)
        </p>
        <p className="mt-2 break-all font-mono text-sm text-ink">{DEPOSIT_ADDRESS}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 rounded-full border border-gold/30 px-4 py-1.5 text-xs font-medium text-gold-ink hover:bg-gold/10"
        >
          {copied ? "Copiato!" : "Copia indirizzo"}
        </button>
        <p className="mt-3 text-xs text-ink-soft">
          Invia solo USDT sulla rete TRC-20. Un deposito su una rete diversa (es. ERC-20 o BEP-20)
          non sarà recuperabile.
        </p>
      </div>

      <form
        ref={formRef}
        action={(formData) => {
          setError(null);
          startTransition(() =>
            submitDeposit(formData)
              .then(() => formRef.current?.reset())
              .catch((err: Error) => setError(err.message))
          );
        }}
        className="space-y-4 rounded-lg border border-line bg-surface p-5"
      >
        <div>
          <label className="block text-xs text-ink-soft">Importo (USDT)</label>
          <input
            name="amount_usdt"
            type="number"
            step="0.01"
            required
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-soft">TXID della transazione (rete TRC-20)</label>
          <input
            name="txid"
            required
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm font-mono"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          disabled={isPending}
          type="submit"
          className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Invia per verifica
        </button>
      </form>
    </div>
  );
}
