"use client";

import { useRef, useState, useTransition } from "react";
import { submitDeposit } from "./actions";

export function DepositForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
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
      className="space-y-4 rounded-2xl border border-line bg-surface p-5"
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
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        disabled={isPending}
        type="submit"
        className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
      >
        Invia per verifica
      </button>
    </form>
  );
}
