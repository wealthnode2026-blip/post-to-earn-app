"use client";

import { useId, useState, useTransition } from "react";
import { buyFilmRoll, buyCamera } from "./actions";

type Camera = {
  plan_type: "pro" | "master";
  name: string;
  price_usdt: number;
  owned: boolean;
};

function FilmRollArt() {
  const gradId = useId();
  const gradId2 = useId();
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14 shrink-0" style={{ filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.4))" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#ff36e0" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id={gradId2} x1="0" y1="0" x2="64" y2="0">
          <stop offset="0%" stopColor="#26e6ff" />
          <stop offset="100%" stopColor="#ff36e0" />
        </linearGradient>
      </defs>
      <rect x="10" y="18" width="44" height="38" rx="8" fill={`url(#${gradId})`} />
      <rect x="16" y="8" width="32" height="14" rx="5" fill={`url(#${gradId2})`} />
      <rect x="24" y="0" width="16" height="10" rx="3" fill="#07050f" />
      <circle cx="32" cy="38" r="11" fill="#07050f" />
      <circle cx="32" cy="38" r="4.5" fill="#07050f" stroke="#ffcf4d" strokeWidth="1.5" />
      <rect x="14" y="30" width="6" height="4" rx="1.5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}

function CameraArt({ variant }: { variant: "pro" | "master" }) {
  const gradId = useId();
  const colors =
    variant === "pro" ? (["#ff36e0", "#a855f7", "#26e6ff"] as const) : (["#ffcf4d", "#ff36e0", "#ffcf4d"] as const);
  return (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10 shrink-0" style={{ filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.4))" }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
      </defs>
      <rect x="4" y="14" width="40" height="26" rx="6" fill={`url(#${gradId})`} />
      <rect x="16" y="8" width="16" height="8" rx="3" fill={`url(#${gradId})`} />
      <circle cx="24" cy="27" r="9" fill="#07050f" />
      <circle cx="24" cy="27" r="5.5" fill={`url(#${gradId})`} opacity="0.55" />
      <circle cx="35" cy="19" r="2" fill={colors[2]} />
    </svg>
  );
}

function ShotsRing({ remaining, total }: { remaining: number; total: number }) {
  const gradId = useId();
  const r = 27;
  const circumference = 2 * Math.PI * r;
  const ratio = total > 0 ? Math.max(0, Math.min(1, remaining / total)) : 0;
  const offset = circumference * (1 - ratio);
  return (
    <div className="shots-ring">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff36e0" />
            <stop offset="50%" stopColor="#26e6ff" />
            <stop offset="100%" stopColor="#2be8b0" />
          </linearGradient>
        </defs>
        <circle className="track" cx="32" cy="32" r={r} fill="none" strokeWidth="6" />
        <circle
          className="progress"
          cx="32"
          cy="32"
          r={r}
          fill="none"
          strokeWidth="6"
          stroke={`url(#${gradId})`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="count">
        <span className="num">{remaining}</span>
        <span className="of">di {total}</span>
      </div>
    </div>
  );
}

export function MarketActionsPanel({
  canBuyRoll,
  cameras,
  shotsRemaining,
  shotsTotal,
  bonusBalance,
  creditBalance,
}: {
  canBuyRoll: boolean;
  cameras: Camera[];
  shotsRemaining?: number;
  shotsTotal?: number;
  bonusBalance?: number;
  creditBalance?: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const hasActiveRoll = typeof shotsRemaining === "number" && typeof shotsTotal === "number";
  const hasBalances = typeof bonusBalance === "number" && typeof creditBalance === "number";

  function handleBuyRoll() {
    setError(null);
    startTransition(() => buyFilmRoll().catch((err: Error) => setError(err.message)));
  }

  function handleBuyCamera(cameraType: "pro" | "master") {
    setError(null);
    startTransition(() => buyCamera(cameraType).catch((err: Error) => setError(err.message)));
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-line bg-surface px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="glass">
        <div className="glass-inner">
          <div className="roll-row flex items-center gap-4">
            <FilmRollArt />
            <div className="roll-text flex-1">
              <p className="eyebrow text-xs text-ink-soft">
                {hasActiveRoll ? "Rullino attivo" : "Rullino"}
              </p>
              <p className="main text-[15.5px] font-medium text-ink">
                {hasActiveRoll ? "Scatti rimasti" : "30 scatti disponibili. Sblocca i guadagni prelevabili."}
              </p>
            </div>
            {hasActiveRoll && <ShotsRing remaining={shotsRemaining!} total={shotsTotal!} />}
          </div>

          {hasBalances && (
            <div className="mt-3.5 flex justify-between font-mono text-xs text-ink-soft">
              <span>Bonus {bonusBalance} USDT</span>
              <span>Saldo {creditBalance} USDT</span>
            </div>
          )}

          <button
            disabled={isPending || !canBuyRoll}
            onClick={handleBuyRoll}
            className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            Compra rullino
          </button>
          {!canBuyRoll && (
            <p className="mt-2 text-xs text-ink-soft">
              Serve saldo depositato per acquistare un rullino.
            </p>
          )}
        </div>
      </div>

      {cameras.length > 0 && (
        <div className="glass">
          <div className="glass-inner">
            <p className="eyebrow text-xs text-ink-soft">Fotocamere</p>
            <div className="mt-3 space-y-2.5">
              {cameras.map((camera) => (
                <div
                  key={camera.plan_type}
                  className="flex items-center gap-3.5 rounded-2xl border border-line px-3.5 py-3"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <CameraArt variant={camera.plan_type} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink">{camera.name}</p>
                    <p className="font-mono text-xs text-ink-soft">{camera.price_usdt} USDT</p>
                  </div>
                  <button
                    disabled={isPending || camera.owned}
                    onClick={() => handleBuyCamera(camera.plan_type)}
                    className={
                      camera.owned
                        ? "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold"
                        : "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold text-white disabled:opacity-40"
                    }
                    style={
                      camera.owned
                        ? {
                            background: "rgba(43,232,176,0.16)",
                            color: "var(--color-neon)",
                            borderColor: "rgba(43,232,176,0.35)",
                          }
                        : {
                            background: "linear-gradient(120deg, var(--color-coral), var(--color-violet))",
                            boxShadow: "0 6px 14px -4px rgba(255,54,224,0.5)",
                          }
                    }
                  >
                    {camera.owned ? "Posseduta" : "Compra"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
