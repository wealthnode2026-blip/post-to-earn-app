"use client";

import { useState, useTransition } from "react";
import { submitVote } from "./actions";
import { PhotoCard } from "../components/photo-card";

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
    <div>
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: "a" as const, url: imageA },
          { key: "b" as const, url: imageB },
        ].map(({ key, url }) => (
          <button
            key={key}
            disabled={isPending || voted !== null}
            onClick={() => vote(key)}
            className={`text-left transition-opacity disabled:cursor-default ${
              voted && voted !== key ? "opacity-40" : ""
            }`}
          >
            <PhotoCard
              imageUrl={url}
              alt="Foto in duello"
              badge={
                voted === key && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-white">
                    Votata
                  </span>
                )
              }
            />
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
