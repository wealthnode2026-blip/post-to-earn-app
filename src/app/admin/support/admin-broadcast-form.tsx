"use client";

import { useTransition } from "react";
import { adminBroadcast } from "./actions";

export function AdminBroadcastForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        if (!window.confirm("Stai per inviare questo annuncio a TUTTI gli iscritti. Confermi?")) {
          return;
        }
        startTransition(() => adminBroadcast(formData));
      }}
      className="space-y-3 rounded-lg border border-line bg-surface p-5"
    >
      <p className="text-sm font-medium text-ink">Annuncio broadcast a tutti gli iscritti</p>
      <div>
        <label className="block text-xs text-ink-soft">Oggetto</label>
        <input
          name="subject"
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Testo</label>
        <textarea
          name="body"
          required
          rows={4}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>
      <button
        disabled={isPending}
        type="submit"
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Invio..." : "Invia a tutti"}
      </button>
    </form>
  );
}
