"use client";

import { useActionState, useState } from "react";
import { uploadDailyPhoto, type UploadState } from "./actions";

const initialState: UploadState = { error: null };

export function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadDailyPhoto, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-6">
      <label
        htmlFor="photo"
        className="group flex aspect-[4/5] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-line bg-surface transition-all hover:border-accent/50 hover:shadow-hover"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Anteprima" className="h-full w-full object-cover" />
        ) : (
          <div className="px-8 text-center">
            <p className="font-display text-lg italic text-ink">Lo scatto di oggi</p>
            <p className="mt-1 text-sm text-ink-soft">Tocca per scegliere una foto</p>
          </div>
        )}
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !preview}
        className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {pending ? "Invio in corso…" : "Pubblica lo scatto di oggi"}
      </button>
    </form>
  );
}
