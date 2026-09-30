import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { WithdrawForm } from "./withdraw-form";
import { networkLabel } from "@/lib/networks";

const STATUS_LABEL: Record<string, string> = {
  pending: "In verifica",
  approved: "Pagato",
  rejected: "Rifiutato",
};

export default async function WithdrawPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("money_balance")
    .eq("id", user.id)
    .single();

  const { data: requests } = await supabase
    .from("withdrawal_requests")
    .select("id, amount_usdt, wallet_address, network, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const balance = Number(profile?.money_balance ?? 0);

  return (
    <>
      <UserNav active="withdraw" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-xl italic text-ink">Preleva USDT</h1>
          <div className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-ink">
            {balance} USDT
          </div>
        </div>

        <p className="mb-4 text-xs text-ink-soft">
          Scegli la rete, inserisci l&apos;importo e l&apos;indirizzo del tuo wallet. Un admin
          verificherà ed eseguirà manualmente il pagamento.
        </p>

        <WithdrawForm balance={balance} />

        {requests && requests.length > 0 && (
          <div className="mt-8 space-y-2">
            <p className="text-xs font-medium text-ink-soft">Storico richieste</p>
            {requests.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="text-xs text-ink-soft">
                  <span className="font-mono">{r.wallet_address.slice(0, 8)}…</span>
                  <span className="ml-1">
                    {networkLabel(String(r.network)).split(" ")[0]}
                  </span>
                </span>
                <span className="text-ink">{r.amount_usdt} USDT</span>
                <span className="text-xs text-ink-soft">{STATUS_LABEL[r.status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
