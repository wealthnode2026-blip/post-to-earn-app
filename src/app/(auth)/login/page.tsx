"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "../actions";
import { Field } from "@/components/ui/field";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div>
      <h1 className="font-display text-xl text-ink">Bentornato</h1>
      <p className="mt-1 text-sm text-ink-soft">Accedi per continuare a scattare.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
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
          {pending ? "Accesso…" : "Accedi"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Non hai un account?{" "}
        <Link href="/signup" className="font-medium text-accent">
          Registrati
        </Link>
      </p>
    </div>
  );
}
