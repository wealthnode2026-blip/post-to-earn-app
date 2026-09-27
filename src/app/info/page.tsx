import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { LandscapeIllustration } from "../components/landscape-illustration";

const ROLL_SHOTS = 30;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatUsdt(n: number) {
  return n % 1 === 0 ? String(n) : n.toFixed(2).replace(".", ",");
}

export default async function InfoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: plans } = await supabase
    .from("camera_plans")
    .select("plan_type, name, price_usdt, roll_price_usdt, credits_per_photo")
    .eq("active", true)
    .order("price_usdt", { ascending: true });

  const sceneVariant = Math.floor(Math.random() * 4);

  return (
    <>
      <UserNav active="info" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <div className="mb-10 info-hero-photo">
          <div className="info-hero-photo-inner flex items-center justify-center px-6 text-center">
            <LandscapeIllustration className="absolute inset-0 h-full w-full" variant={sceneVariant} />
            <div className="absolute inset-0 bg-black/35" />
            <div className="relative">
              <p className="font-display text-2xl italic text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                Le tue foto, il tuo guadagno
              </p>
              <p className="mt-2 text-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                Scatta una foto al giorno, fatti approvare e preleva in USDT.
              </p>
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-ink-soft">
            Nessuna sorpresa, nessun vincolo nascosto.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3 rounded-lg border border-neon/20 bg-neon-soft px-4 py-3">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-sm font-medium text-ink">Pagamenti verificati</p>
              <p className="text-xs text-ink-soft">
                Ogni deposito e prelievo è controllato a mano da un admin, transazione per transazione.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent-soft px-4 py-3">
            <span className="text-lg">💵</span>
            <div>
              <p className="text-sm font-medium text-ink">1 credito = 1 USDT</p>
              <p className="text-xs text-ink-soft">
                Cambio fisso, sempre. Quello che guadagni è quello che preleverai.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg border border-gold/20 bg-gold-soft px-4 py-3">
            <span className="text-lg">👁️</span>
            <div>
              <p className="text-sm font-medium text-ink">Community moderata</p>
              <p className="text-xs text-ink-soft">
                Ogni foto viene rivista da un admin prima di essere approvata e pagata.
              </p>
            </div>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg italic text-ink">Quanto puoi guadagnare</h2>
        <div className="mb-8 space-y-3">
          {(plans ?? []).map((plan) => {
            const price = Number(plan.price_usdt);
            const rollPrice = Number(plan.roll_price_usdt);
            const potentialEarnings = ROLL_SHOTS * Number(plan.credits_per_photo);
            return (
              <div
                key={plan.plan_type}
                className="rounded-lg border border-line bg-surface-raised p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-base italic text-ink">
                    {capitalize(plan.plan_type)}
                  </p>
                  <p className="font-mono text-sm font-medium text-neon-ink">
                    fino a {formatUsdt(potentialEarnings)} USDT
                  </p>
                </div>
                <p className="mt-1 text-xs text-ink-soft">
                  {price > 0 ? `Fotocamera ${formatUsdt(price)} USDT (una volta sola) · ` : "Fotocamera gratuita · "}
                  rullino {formatUsdt(rollPrice)} USDT ({ROLL_SHOTS} scatti)
                </p>
              </div>
            );
          })}
        </div>
        <p className="mb-10 text-xs text-ink-soft">
          Guadagno potenziale se ogni foto del rullino viene approvata. La fotocamera si paga una sola volta: dal secondo rullino in poi acquisti solo il rullino.
        </p>

        <h2 className="mb-4 font-display text-lg italic text-ink">Come funziona</h2>
        <div className="mb-8 space-y-3">
          {[
            { n: "1", t: "Scegli la fotocamera", d: "Parti gratis con Base, o investi subito in Pro o Master per guadagnare di più a foto." },
            { n: "2", t: "Carica una foto al giorno", d: "Un solo scatto al giorno, quando vuoi. Conta solo la qualità." },
            { n: "3", t: "Un admin la approva", d: "Ricevi i crediti appena la foto passa la moderazione." },
            { n: "4", t: "Preleva quando vuoi", d: "Richiedi il prelievo in USDT: nessun importo minimo nascosto." },
          ].map((step) => (
            <div key={step.n} className="flex gap-3 rounded-lg border border-line bg-surface p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-xs font-medium text-accent-ink">
                {step.n}
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{step.t}</p>
                <p className="text-xs text-ink-soft">{step.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-line bg-surface p-4 text-sm text-ink-soft">
          <p>
            <span className="text-ink">Hall of Fame.</span> La foto più votata ogni settimana nell&apos;Arena resta in vetrina per sempre.
          </p>
          <p className="mt-2">
            <span className="text-ink">Invita un amico.</span> Ricevi 0,25 USDT quando compra il suo primo rullino.
          </p>
        </div>
      </div>
    </>
  );
}
