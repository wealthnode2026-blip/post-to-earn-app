import type { DuelsPhase } from "@/utils/date";

const COPY: Record<DuelsPhase, { title: string; hint: string; style: string }> = {
  before: {
    title: "Le votazioni ai Duelli aprono sabato",
    hint: "Chiudono domenica. Torna qui quando iniziano per votare la tua foto preferita.",
    style: "border-accent/20 bg-accent-soft text-accent-ink",
  },
  open: {
    title: "Le votazioni sono aperte!",
    hint: "Chiudono domani. Vota ora i duelli qui sotto.",
    style: "border-neon/20 bg-neon-soft text-neon-ink",
  },
  "last-day": {
    title: "Ultimo giorno per votare",
    hint: "Le votazioni chiudono questa sera. Non perdere l'occasione di votare.",
    style: "border-gold/20 bg-gold-soft text-gold-ink",
  },
};

export function DuelBanner({ phase, prize }: { phase: DuelsPhase; prize: string }) {
  const copy = COPY[phase];

  return (
    <div className={`mb-8 rounded-lg border p-4 ${copy.style}`}>
      <p className="font-medium">{copy.title}</p>
      <p className="mt-1 text-sm opacity-90">{copy.hint}</p>
      {prize && (
        <p className="mt-2 text-sm font-medium">
          🏆 Premio in palio: {prize}
        </p>
      )}
    </div>
  );
}
