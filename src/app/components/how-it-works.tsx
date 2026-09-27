type CameraPlan = {
  plan_type: string;
  name: string;
  price_usdt: number;
  roll_price_usdt: number;
  credits_per_photo: number;
};

const ROLL_SHOTS = 30;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatUsdt(n: number) {
  return n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",");
}

export function HowItWorks({ plans }: { plans: CameraPlan[] }) {
  return (
    <details className="mb-6 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink-soft [&_summary]:cursor-pointer">
      <summary className="font-medium text-ink">Come funziona</summary>
      <div className="mt-4 space-y-4">
        <p>
          Scatta una foto al giorno e trasformala in guadagno vero: ogni foto
          approvata ti fa guadagnare crediti che puoi prelevare quando vuoi,
          direttamente in USDT.
        </p>

        <div className="space-y-2">
          {plans.map((plan) => {
            const price = Number(plan.price_usdt);
            const rollPrice = Number(plan.roll_price_usdt);
            const potentialEarnings = ROLL_SHOTS * Number(plan.credits_per_photo);
            return (
              <div
                key={plan.plan_type}
                className="flex items-center justify-between rounded-lg border border-line bg-surface-raised px-3 py-2"
              >
                <div>
                  <p className="text-ink">{capitalize(plan.plan_type)}</p>
                  <p className="text-xs">
                    {price > 0 ? `Fotocamera ${formatUsdt(price)} USDT · ` : ""}
                    rullino {formatUsdt(rollPrice)} USDT
                  </p>
                </div>
                <p className="font-mono text-sm text-neon-ink">
                  fino a {formatUsdt(potentialEarnings)} USDT
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-xs">
          Guadagno potenziale per rullino (30 scatti), se ogni foto viene
          approvata. La fotocamera si acquista una sola volta: dal secondo
          rullino in poi paghi solo il rullino.
        </p>

        <p>
          <span className="text-ink">Hall of Fame.</span> Le foto più belle
          restano in vetrina per sempre.
        </p>
        <p>
          <span className="text-ink">Arena dei Duelli.</span> Arriva presto:
          sfida gli altri fotografi e vinci premi in USDT.
        </p>
        <p>
          <span className="text-ink">Invita un amico.</span> Condividi il tuo
          link: quando il tuo amico compra il suo primo rullino, ricevi 0.25
          USDT.
        </p>
        <p>
          <span className="text-ink">Deposita e preleva.</span> Deposita USDT
          per comprare rullini e fotocamere, e preleva i tuoi crediti quando
          vuoi: 1 credito = 1 USDT.
        </p>
      </div>
    </details>
  );
}
