import { createClient } from "@/utils/supabase/server";
import { PlanRow } from "./plan-row";
import { NewPlanForm } from "./new-plan-form";

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("camera_plans")
    .select("id, name, plan_type, multiplier, price_usdt, active")
    .order("price_usdt", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Gestione shop</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Configura nome, moltiplicatore e prezzo delle fotocamere disponibili.
      </p>

      <div className="mt-8 space-y-3">
        {(plans ?? []).map((p) => (
          <PlanRow key={p.id} plan={p} />
        ))}
      </div>

      <NewPlanForm />
    </div>
  );
}
