"use client";

import { useState, useTransition } from "react";
import { updateCameraPlan, toggleCameraPlanActive, deleteCameraPlan } from "./actions";

type CameraPlan = {
  id: string;
  name: string;
  plan_type: string;
  multiplier: number;
  price_usdt: number;
  active: boolean;
};

export function PlanRow({ plan }: { plan: CameraPlan }) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(plan.name);
  const [multiplier, setMultiplier] = useState(String(plan.multiplier));
  const [price, setPrice] = useState(String(plan.price_usdt));
  const [dirty, setDirty] = useState(false);

  function save() {
    startTransition(() =>
      updateCameraPlan(plan.id, {
        name,
        multiplier: Number(multiplier),
        price_usdt: Number(price),
      }).then(() => setDirty(false))
    );
  }

  return (
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setDirty(true);
          }}
          className="w-full rounded-md border border-line bg-transparent px-2 py-1 text-ink"
        />
      </td>
      <td className="px-4 py-3 capitalize text-ink-soft">{plan.plan_type}</td>
      <td className="px-4 py-3">
        <input
          type="number"
          step="0.1"
          value={multiplier}
          onChange={(e) => {
            setMultiplier(e.target.value);
            setDirty(true);
          }}
          className="w-20 rounded-md border border-line bg-transparent px-2 py-1 text-ink"
        />
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setDirty(true);
          }}
          className="w-24 rounded-md border border-line bg-transparent px-2 py-1 text-ink"
        />
      </td>
      <td className="px-4 py-3">
        <button
          disabled={isPending}
          onClick={() => startTransition(() => toggleCameraPlanActive(plan.id, !plan.active))}
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            plan.active ? "bg-green-50 text-green-600" : "bg-pearl text-ink-soft"
          }`}
        >
          {plan.active ? "Attiva" : "Disattivata"}
        </button>
      </td>
      <td className="px-4 py-3 text-right space-x-2">
        {dirty && (
          <button
            disabled={isPending}
            onClick={save}
            className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Salva
          </button>
        )}
        <button
          disabled={isPending}
          onClick={() => {
            if (confirm(`Eliminare "${plan.name}"?`)) {
              startTransition(() => deleteCameraPlan(plan.id));
            }
          }}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-pearl disabled:opacity-40"
        >
          Elimina
        </button>
      </td>
    </tr>
  );
}
