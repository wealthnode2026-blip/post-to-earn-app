import { createClient } from "@/utils/supabase/server";
import { UserRow } from "./user-row";

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select(
      "id, username, plan, multiplier, money_balance, is_admin, is_banned, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Gestione utenti</h1>
      <p className="mt-1 text-sm text-ink-soft">{users?.length ?? 0} utenti registrati.</p>

      <div className="mt-8 space-y-3">
        {(users ?? []).map((u) => (
          <UserRow key={u.id} user={u} />
        ))}
      </div>
    </div>
  );
}
