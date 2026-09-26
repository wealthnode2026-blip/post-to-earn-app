"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "../actions";
import { Field } from "@/components/ui/field";

const initialState: AuthState = { error: null };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <div>
      <h1 className="font-display text-xl text-ink">Crea il tuo account</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Inizia con la Fotocamera Senza Rullino, gratuita.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <Field label="Nome utente" name="username" type="text" autoComplete="username" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Creazione account…" : "Crea account"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-accent">
          Accedi
        </Link>
      </p>
    </div>
  );
}
