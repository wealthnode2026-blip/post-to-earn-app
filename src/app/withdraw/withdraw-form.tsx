"use client";

import { useRef, useState, useTransition } from "react";
import { submitWithdrawal } from "./actions";
import { NETWORKS, NETWORK_LABEL, ADDRESS_PLACEHOLDER, type Network } from "@/lib/networks";

const NETWORK_WARNING: Record<Network, string> = {
  BTC: "Il prelievo su Bitcoin viene pagato in BTC, al controvalore in USDT al momento del pagamento. Usa solo un indirizzo Bitcoin.",
  ETH: "Riceverai USDT sulla rete Ethereum (ERC-20). Usa solo un indirizzo Ethereum: un invio su rete diversa non è recuperabile.",
  BSC: "Riceverai USDT sulla rete BNB Smart Chain (BEP-20). Usa solo un indirizzo BSC: un invio su rete diversa non è recuperabile.",
  TRC20:
    "Riceverai USDT sulla rete TRON (TRC-20). Usa solo un indirizzo TRON: un invio su rete diversa non è recuperabile.",
};

export function WithdrawForm({ balance }: { balance: number }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>("TRC20");
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        setError(null);
        startTransition(async () => {
          const result = await submitWithdrawal(formData);
          if (result?.error) {
            setError(result.error);
          } else {
            formRef.current?.reset();
          }
        });
      }}
      className="space-y-4 rounded-lg border border-line bg-surface p-5"
    >
      <div>
        <label className="block text-xs text-ink-soft">Rete di prelievo</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {NETWORKS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNetwork(n)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                n === network
                  ? "bg-accent text-white"
                  : "border border-line text-ink-soft hover:bg-pearl"
              }`}
            >
              {NETWORK_LABEL[n]}
            </button>
          ))}
        </div>
        <input type="hidden" name="network" value={network} />
        <p className="mt-2 text-xs text-ink-soft">{NETWORK_WARNING[network]}</p>
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Importo da prelevare (USDT)</label>
        <input
          name="amount_usdt"
          type="number"
          step="0.01"
          max={balance}
          min={15}
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
        <p className="mt-1 text-xs text-ink-soft">Saldo disponibile: {balance} USDT</p>
        <p className="mt-1 text-xs text-ink-soft">Importo minimo prelevabile: 15 USDT</p>
      </div>
      <div>
        <label className="block text-xs text-ink-soft">
          Indirizzo wallet ({NETWORK_LABEL[network]})
        </label>
        <input
          name="wallet_address"
          required
          placeholder={ADDRESS_PLACEHOLDER[network]}
          autoComplete="off"
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
