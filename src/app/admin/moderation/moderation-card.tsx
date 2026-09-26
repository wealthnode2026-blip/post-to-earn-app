"use client";

import { useTransition } from "react";
import { approvePost, rejectPost } from "./actions";

export function ModerationCard({
  postId,
  username,
  imageUrl,
}: {
  postId: string;
  username: string;
  imageUrl: string | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={`Scatto di ${username}`} className="aspect-[4/5] w-full object-cover" />
      )}
      <div className="p-4">
        <p className="text-sm font-medium text-ink">{username}</p>
        <div className="mt-3 flex gap-2">
          <button
            disabled={isPending}
            onClick={() => startTransition(() => approvePost(postId))}
            className="flex-1 rounded-full bg-accent py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Approva
          </button>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => rejectPost(postId))}
            className="flex-1 rounded-full border border-line py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-pearl disabled:opacity-40"
          >
            Rifiuta
          </button>
        </div>
      </div>
    </div>
  );
}
