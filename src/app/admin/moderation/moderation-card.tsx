"use client";

import { useState, useTransition } from "react";
import { approvePost, rejectPost } from "./actions";
import { REJECTION_REASONS, MAX_REJECTION_NOTE } from "@/lib/rejection-reasons";

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
  const [rejecting, setRejecting] = useState(false);
  const [reasonKey, setReasonKey] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  function confirmReject() {
    setError(null);
    startTransition(() =>
      rejectPost(postId, reasonKey, note).catch((err: Error) => setError(err.message))
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={`Scatto di ${username}`} className="aspect-[4/5] w-full object-cover" />
      )}
      <div className="p-4">
        <p className="text-sm font-medium text-ink">{username}</p>

        {!rejecting ? (
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
              onClick={() => setRejecting(true)}
              className="flex-1 rounded-full border border-line py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-pearl disabled:opacity-40"
            >
              Rifiuta
            </button>
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            <label className="block text-xs text-ink-soft" htmlFor={`reason-${postId}`}>
              Motivo del rifiuto (lo vede l&apos;utente)
            </label>
            <select
              id={`reason-${postId}`}
              value={reasonKey}
              onChange={(e) => setReasonKey(e.target.value)}
              className="w-full rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
            >
              <option value="">Scegli un motivo…</option>
              {REJECTION_REASONS.map((r) => (
                <option key={r.key} value={r.key}>
                  {r.label}
                </option>
              ))}
            </select>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={MAX_REJECTION_NOTE}
              rows={2}
              placeholder={
                reasonKey === "other" ? "Scrivi il motivo (obbligatorio)" : "Nota per l'utente (facoltativa)"
              }
              className="w-full rounded-lg border border-line bg-pearl px-3 py-2 text-sm text-ink"
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                disabled={isPending || !reasonKey}
                onClick={confirmReject}
                className="flex-1 rounded-full bg-red-500 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {isPending ? "Invio…" : "Conferma rifiuto"}
              </button>
              <button
                disabled={isPending}
                onClick={() => {
                  setRejecting(false);
                  setError(null);
                }}
                className="flex-1 rounded-full border border-line py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-pearl disabled:opacity-40"
              >
                Annulla
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
