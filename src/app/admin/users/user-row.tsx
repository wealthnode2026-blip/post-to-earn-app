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
    <tr className="border-b border-line last:border-0">
      <td className="px-4 py-3 text-ink">{user.username ?? "—"}</td>
      <td className="px-4 py-3 capitalize text-ink-soft">
        {user.plan} · {user.multiplier}x
      </td>
      <td className="px-4 py-3 text-ink-soft">{user.credit_balance}</td>
      <td className="px-4 py-3 text-ink-soft">{user.money_balance}</td>
      <td className="px-4 py-3">
        {user.is_banned ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
            Bannato
          </span>
        ) : (
          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
            Attivo
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
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
      </td>
    </tr>
  );
}
