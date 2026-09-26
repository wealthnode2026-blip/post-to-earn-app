"use client";

import { useRef, useTransition } from "react";
import { createCameraPlan } from "./actions";

export function NewPlanForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(() => createCameraPlan(formData).then(() => formRef.current?.reset()));
      }}
      className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface p-4"
    >
      <div>
        <label className="block text-xs text-ink-soft">Nome</label>
        <input name="name" required className="mt-1 rounded-md border border-line px-2 py-1.5 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Piano</label>
        <select name="plan_type" className="mt-1 rounded-md border border-line px-2 py-1.5 text-sm">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="master">Master</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Moltiplicatore</label>
        <input
          name="multiplier"
          type="number"
          step="0.1"
          defaultValue="1"
          className="mt-1 w-24 rounded-md border border-line px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Prezzo (USDT)</label>
        <input
          name="price_usdt"
          type="number"
          step="0.01"
          defaultValue="0"
          className="mt-1 w-28 rounded-md border border-line px-2 py-1.5 text-sm"
        />
      </div>
      <button
        disabled={isPending}
        type="submit"
        className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
      >
        Aggiungi
      </button>
    </form>
  );
}
