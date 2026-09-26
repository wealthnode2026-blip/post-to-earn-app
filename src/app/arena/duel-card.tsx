"use client";

import { useState, useTransition } from "react";
import { submitVote } from "./actions";

export function DuelCard({
  duelId,
  imageA,
  imageB,
}: {
  duelId: string;
  imageA: string | null;
  imageB: string | null;
}) {
  const [isPending, startTransition] = useTransition();
  const [voted, setVoted] = useState<"a" | "b" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function vote(choice: "a" | "b") {
    setError(null);
    startTransition(() =>
      submitVote(duelId, choice)
        .then(() => setVoted(choice))
        .catch((err: Error) => setError(err.message))
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="grid grid-cols-2 gap-px bg-line">
        {[
          { key: "a" as const, url: imageA },
          { key: "b" as const, url: imageB },
        ].map(({ key, url }) => (
          <button
            key={key}
            disabled={isPending || voted !== null}
            onClick={() => vote(key)}
            className={`relative aspect-[4/5] bg-surface transition-opacity ${
              voted && voted !== key ? "opacity-40" : ""
            } disabled:cursor-default`}
          >
            {url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={url} alt="Foto in duello" className="h-full w-full object-cover" />
            )}
            {voted === key && (
              <span className="absolute bottom-2 right-2 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-white">
                Votata
              </span>
            )}
          </button>
        ))}
      </div>
      {error && <p className="px-4 py-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
