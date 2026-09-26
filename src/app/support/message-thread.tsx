"use client";

import { useState, useTransition } from "react";

type Message = {
  id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

export function MessageThread({
  messages,
  onSend,
  disabled,
}: {
  messages: Message[];
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit() {
    setError(null);
    startTransition(() =>
      onSend(text)
        .then(() => setText(""))
        .catch((err: Error) => setError(err.message))
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
              m.sender === "admin"
                ? "ml-auto bg-accent text-white"
                : "bg-surface border border-line text-ink"
            }`}
          >
            {m.message}
          </div>
        ))}
      </div>

      {!disabled && (
        <div className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 rounded-full border border-line px-4 py-2 text-sm"
          />
          <button
            disabled={isPending || !text.trim()}
            onClick={submit}
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            Invia
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
