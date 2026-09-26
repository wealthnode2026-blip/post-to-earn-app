import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { MarketActionsPanel } from "./market-actions-panel";

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, master: 2 };
const FILM_ROLL_SHOTS = 30;

export default async function MarketPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, trial_started_at, money_balance, bonus_balance")
    .eq("id", user.id)
    .single();

  const { data: activeRoll } = await supabase
    .from("film_rolls")
    .select("shots_remaining")
    .eq("user_id", user.id)
    .gt("shots_remaining", 0)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: plans } = await supabase
    .from("camera_plans")
    .select("plan_type, name, price_usdt")
    .in("plan_type", ["pro", "master"])
    .eq("active", true)
    .order("price_usdt", { ascending: true });

  const currentPlan = profile?.plan ?? "free";
  const trialStart = profile?.trial_started_at ? new Date(profile.trial_started_at) : null;
  const trialEnd = trialStart ? new Date(trialStart.getTime() + 3 * 24 * 60 * 60 * 1000) : null;
  const trialActive = trialEnd ? trialEnd.getTime() > Date.now() : false;
  const trialDaysLeft = trialEnd
    ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  const cameras = (plans ?? []).map((p) => ({
    plan_type: p.plan_type as "pro" | "master",
    name: p.name,
    price_usdt: Number(p.price_usdt),
    owned: PLAN_RANK[currentPlan] >= PLAN_RANK[p.plan_type],
  }));

  return (
    <>
      <UserNav active="market" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-xl italic text-ink">Market</h1>

        <div className="mt-6 rounded-lg border border-line bg-surface p-5 text-sm">
          {trialActive && (
            <p className="text-ink">
              Prova gratuita attiva — {trialDaysLeft} giorno/i rimasti. I guadagni sono in bonus,
              non ancora prelevabili.
            </p>
          )}
          {!trialActive && activeRoll && (
            <p className="text-ink">
              Rullino attivo — {activeRoll.shots_remaining} scatti rimasti.
            </p>
          )}
          {!trialActive && !activeRoll && (
            <p className="text-ink">
              Nessun rullino attivo. Acquistane uno per riprendere a caricare foto e guadagnare
              USDT prelevabili.
            </p>
          )}
        </div>

        <div className="mt-6">
          <MarketActionsPanel
            canBuyRoll={Number(profile?.money_balance ?? 0) > 0}
            cameras={cameras}
            shotsRemaining={activeRoll ? activeRoll.shots_remaining : undefined}
            shotsTotal={activeRoll ? FILM_ROLL_SHOTS : undefined}
            bonusBalance={Number(profile?.bonus_balance ?? 0)}
            creditBalance={Number(profile?.money_balance ?? 0)}
          />
        </div>
      </div>
    </>
  );
}
