"use client";

import { useTransition } from "react";
import { setUserBan } from "./actions";

type UserProfile = {
  id: string;
  username: string | null;
  plan: string;
  multiplier: number;
  credit_balance: number;
  money_balance: number;
  is_admin: boolean;
  is_banned: boolean;
};

export function UserRow({ user }: { user: UserProfile }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="truncate font-medium text-ink">{user.username ?? "—"}</p>
        {user.is_banned ? (
          <span className="shrink-0 rounded-full bg-red-950 px-2.5 py-1 text-xs font-medium text-red-300">
            Bannato
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-neon-soft px-2.5 py-1 text-xs font-medium text-neon-ink">
            Attivo
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
        <div>
          <span className="block text-xs text-ink-soft">Piano</span>
          <span className="capitalize text-ink">
            {user.plan} · {user.multiplier}x
          </span>
        </div>
        <div>
          <span className="block text-xs text-ink-soft">Crediti</span>
          <span className="font-mono text-ink">{user.credit_balance}</span>
        </div>
        <div>
          <span className="block text-xs text-ink-soft">Saldo (USDT)</span>
          <span className="font-mono text-ink">{user.money_balance}</span>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        {user.is_admin ? (
          <span className="text-xs text-ink-soft">Admin</span>
        ) : (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => setUserBan(user.id, !user.is_banned))}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90 disabled:opacity-40 ${
              user.is_banned
                ? "bg-accent text-white"
                : "border border-line text-ink-soft hover:bg-pearl"
            }`}
          >
            {user.is_banned ? "Riattiva" : "Banna"}
          </button>
        )}
      </div>
    </div>
  );
}
