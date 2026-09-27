"use client";

import { useRef, useState, useTransition } from "react";
import { submitDeposit } from "./actions";

type DepositAddress = {
  network: string;
  address: string;
};

const NETWORK_LABEL: Record<string, string> = {
  BTC: "Bitcoin (BTC)",
  ETH: "Ethereum (ERC-20)",
  BSC: "BNB Smart Chain (BEP-20)",
  TRC20: "USDT (TRC-20 / TRON)",
};

const NETWORK_WARNING: Record<string, string> = {
  BTC: "Invia solo Bitcoin (rete BTC). Un deposito su una rete diversa non sarà recuperabile.",
  ETH: "Invia solo asset sulla rete Ethereum (ERC-20). Un deposito su una rete diversa non sarà recuperabile.",
  BSC: "Invia solo asset sulla rete BNB Smart Chain (BEP-20). Un deposito su una rete diversa non sarà recuperabile.",
  TRC20:
    "Invia solo USDT sulla rete TRC-20. Un deposito su una rete diversa (es. ERC-20 o BEP-20) non sarà recuperabile.",
};

export function DepositForm({ addresses }: { addresses: DepositAddress[] }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(addresses[0]?.network ?? "");
  const formRef = useRef<HTMLFormElement>(null);

  const selected = addresses.find((a) => a.network === selectedNetwork) ?? addresses[0];

  function handleCopy() {
    if (!selected) return;
    navigator.clipboard.writeText(selected.address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!selected) {
    return (
      <p className="text-xs text-ink-soft">
        Nessun indirizzo di deposito disponibile al momento. Riprova più tardi.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gold/20 bg-gold-soft p-5">
        <div className="flex flex-wrap gap-2">
          {addresses.map((a) => (
            <button
              key={a.network}
              type="button"
              onClick={() => {
                setSelectedNetwork(a.network);
                setCopied(false);
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                a.network === selectedNetwork
                  ? "bg-gold text-black"
                  : "border border-gold/30 text-gold-ink hover:bg-gold/10"
              }`}
            >
              {NETWORK_LABEL[a.network] ?? a.network}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs font-medium text-gold-ink">
          Indirizzo di deposito — {NETWORK_LABEL[selected.network] ?? selected.network}
        </p>
        <p className="mt-2 break-all font-mono text-sm text-ink">{selected.address}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 rounded-full border border-gold/30 px-4 py-1.5 text-xs font-medium text-gold-ink hover:bg-gold/10"
        >
          {copied ? "Copiato!" : "Copia indirizzo"}
        </button>
        <p className="mt-3 text-xs text-ink-soft">
          {NETWORK_WARNING[selected.network] ??
            "Invia solo sulla rete indicata. Un deposito su una rete diversa non sarà recuperabile."}
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
        <input type="hidden" name="network" value={selected.network} />
        <div>
          <label className="block text-xs text-ink-soft">Importo (equivalente in USDT)</label>
          <input
            name="amount_usdt"
            type="number"
            step="0.01"
            required
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-ink-soft">
            TXID della transazione ({NETWORK_LABEL[selected.network] ?? selected.network})
          </label>
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
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          Invia per verifica
        </button>
      </form>
    </div>
  );
}
