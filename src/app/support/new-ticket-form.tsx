"use client";

import { useTransition } from "react";
import { createTicket } from "./actions";

export function NewTicketForm() {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => startTransition(() => createTicket(formData))}
      className="space-y-3 rounded-2xl border border-line bg-surface p-5"
    >
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
        className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
      >
        Apri ticket
      </button>
    </form>
  );
}
