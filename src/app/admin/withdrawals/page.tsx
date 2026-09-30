import { createClient } from "@/utils/supabase/server";
import { WithdrawalRow } from "./withdrawal-row";

export default async function WithdrawalsPage() {
  const supabase = await createClient();

  const { data: requests } = await supabase
    .from("withdrawal_requests")
    .select(
      "id, amount_usdt, wallet_address, network, created_at, profiles!withdrawal_requests_user_id_fkey(username)"
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const items = (requests ?? []).map((r) => {
    const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      id: r.id,
      amount_usdt: r.amount_usdt,
      wallet_address: r.wallet_address,
      network: r.network,
      created_at: r.created_at,
      username: profile?.username ?? "utente",
    };
  });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Prelievi</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length === 0 ? "Nessuna richiesta in attesa." : `${items.length} richieste da evadere.`}
      </p>

      {items.length > 0 && (
        <div className="mt-8 space-y-3">
          {items.map((r) => (
            <WithdrawalRow key={r.id} req={r} />
          ))}
        </div>
      )}
    </div>
  );
}
