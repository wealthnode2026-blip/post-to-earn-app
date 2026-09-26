import { createClient } from "@/utils/supabase/server";
import { UserRow } from "./user-row";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select(
      "id, username, plan, multiplier, credit_balance, money_balance, is_admin, is_banned, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Gestione utenti</h1>
      <p className="mt-1 text-sm text-ink-soft">{users?.length ?? 0} utenti registrati.</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-pearl/50 text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Utente</th>
              <th className="px-4 py-3 font-medium">Piano</th>
              <th className="px-4 py-3 font-medium">Crediti</th>
              <th className="px-4 py-3 font-medium">Saldo (USDT)</th>
              <th className="px-4 py-3 font-medium">Stato</th>
              <th className="px-4 py-3 font-medium text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {(users ?? []).map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
