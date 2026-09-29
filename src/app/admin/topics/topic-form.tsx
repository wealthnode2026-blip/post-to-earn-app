"use client";

import { useState, useTransition } from "react";
import { saveTopic } from "./actions";

export function TopicForm({ defaultDate }: { defaultDate: string }) {
  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(() =>
      saveTopic(date, title, description)
        .then(() => {
          setMessage("Argomento salvato.");
          setTitle("");
          setDescription("");
        })
        .catch((err: Error) => setMessage(err.message))
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded-lg border border-line bg-surface p-4"
    >
      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="topic-date">
          Giorno
        </label>
        <input
          id="topic-date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="topic-title">
          Argomento della foto
        </label>
        <input
          id="topic-title"
          type="text"
          required
          maxLength={80}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
          placeholder="Es. Riflessi"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-ink-soft" htmlFor="topic-description">
          Descrizione (facoltativa)
        </label>
        <textarea
          id="topic-description"
          maxLength={300}
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
          placeholder="Es. Cerca un riflesso inaspettato: acqua, vetri, specchi."
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          {isPending ? "Salvataggio…" : "Salva argomento"}
        </button>
        {message && <span className="text-sm text-ink-soft">{message}</span>}
      </div>
      <p className="text-xs text-ink-soft">
        Se per quel giorno esiste già un argomento, viene sostituito.
      </p>
    </form>
  );
}
