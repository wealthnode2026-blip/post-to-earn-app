import { createClient } from "@/utils/supabase/server";
import { DepositRow } from "./deposit-row";

export default async function DepositsPage() {
  const supabase = await createClient();

  const { data: transactions } = await supabase
    .from("crypto_transactions")
    .select("id, txid, amount_usdt, created_at, profiles!crypto_transactions_user_id_fkey(username)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const items = (transactions ?? []).map((t) => {
    const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
    return {
      id: t.id,
      txid: t.txid,
      amount_usdt: t.amount_usdt,
      created_at: t.created_at,
      username: profile?.username ?? "utente",
    };
  });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Depositi crypto</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length === 0 ? "Nessuna richiesta in attesa." : `${items.length} richieste da verificare.`}
      </p>

      {items.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-pearl/50 text-ink-soft">
              <tr>
                <th className="px-4 py-3 font-medium">Utente</th>
                <th className="px-4 py-3 font-medium">Importo</th>
                <th className="px-4 py-3 font-medium">TXID (Tronscan)</th>
                <th className="px-4 py-3 font-medium text-right">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <DepositRow key={t.id} tx={t} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
