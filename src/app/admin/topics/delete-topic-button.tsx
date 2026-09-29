"use client";

import { useState, useTransition } from "react";
import { deleteTopic } from "./actions";

export function DeleteTopicButton({ topicDate }: { topicDate: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setError(null);
          startTransition(() => deleteTopic(topicDate).catch((err: Error) => setError(err.message)));
        }}
        className="text-xs font-medium text-red-400 hover:opacity-80 disabled:opacity-40"
      >
        Elimina
      </button>
    </div>
  );
}
