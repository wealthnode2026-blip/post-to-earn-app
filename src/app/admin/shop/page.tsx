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

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-pearl/50 text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Piano</th>
              <th className="px-4 py-3 font-medium">Moltiplicatore</th>
              <th className="px-4 py-3 font-medium">Prezzo (USDT)</th>
              <th className="px-4 py-3 font-medium">Stato</th>
              <th className="px-4 py-3 font-medium text-right">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {(plans ?? []).map((p) => (
              <PlanRow key={p.id} plan={p} />
            ))}
          </tbody>
        </table>
      </div>

      <NewPlanForm />
    </div>
  );
}
