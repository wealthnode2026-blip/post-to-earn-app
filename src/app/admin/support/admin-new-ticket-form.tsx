"use client";

import { useTransition } from "react";
import { adminCreateTicket } from "./actions";

export function AdminNewTicketForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => adminCreateTicket(formData))}
      className="space-y-3 rounded-lg border border-line bg-surface p-5"
    >
      <p className="text-sm font-medium text-ink">Nuovo ticket verso un utente</p>
      <div>
        <label className="block text-xs text-ink-soft">Username destinatario</label>
        <input
          name="username"
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Oggetto</label>
        <input
          name="subject"
          required
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-ink-soft">Messaggio</label>
        <textarea
          name="message"
          required
          rows={3}
          className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm"
        />
      </div>
      <button
        disabled={isPending}
        type="submit"
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPending ? "Invio..." : "Invia ticket"}
      </button>
    </form>
  );
}
