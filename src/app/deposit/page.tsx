import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { DepositForm } from "./deposit-form";

const STATUS_LABEL: Record<string, string> = {
  pending: "In verifica",
  approved: "Approvato",
  rejected: "Rifiutato",
};

export default async function DepositPage() {
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

  const { data: transactions } = await supabase
    .from("crypto_transactions")
    .select("id, txid, amount_usdt, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <UserNav active="deposit" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-xl italic text-ink">Deposita USDT</h1>
          <div className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-ink">
            {profile?.money_balance ?? 0} USDT
          </div>
        </div>

        <p className="mb-4 text-xs text-ink-soft">
          Invia USDT sulla rete TRC-20 all&apos;indirizzo indicato nello Shop, poi incolla qui il
          TXID della transazione. Un admin verificherà la transazione e accrediterà il saldo.
        </p>

        <DepositForm />

        {transactions && transactions.length > 0 && (
          <div className="mt-8 space-y-2">
            <p className="text-xs font-medium text-ink-soft">Storico richieste</p>
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm"
              >
                <span className="font-mono text-xs text-ink-soft">{t.txid.slice(0, 10)}…</span>
                <span className="text-ink">{t.amount_usdt} USDT</span>
                <span className="text-xs text-ink-soft">{STATUS_LABEL[t.status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
