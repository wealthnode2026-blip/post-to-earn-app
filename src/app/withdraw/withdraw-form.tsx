"use client";

import { useRef, useState, useTransition } from "react";
import { submitWithdrawal } from "./actions";

export function WithdrawForm({ balance }: { balance: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(() =>
          submitWithdrawal(formData)
            .then(() => formRef.current?.reset())
            .catch((err: Error) => setError(err.message))
        );
      }}
      className="space-y-4 rounded-lg border border-line bg-surface p-5"
    >
      <div>
        <label className="block text-xs text-ink-soft">Importo da prelevare (USDT)</label>
        <input
          name="amount_usdt"
          type="number"
          step="0.01"
          max={balance}
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-ink-soft">Saldo disponibile: {balance} USDT</p>
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Indirizzo wallet (rete TRC-20)</label>
        <input
          name="wallet_address"
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm font-mono"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        disabled={isPending}
        type="submit"
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        Richiedi prelievo
      </button>
    </form>
  );
}
