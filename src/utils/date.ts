const ROME_TZ = "Europe/Rome";

// Data (YYYY-MM-DD) nel fuso di Roma: e' il "giorno" di tutta l'app
// (limite una foto al giorno, tema del giorno, settimana dei duelli).
export function todayRomeISO(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ROME_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

// Differenza in ms tra l'ora di Roma e UTC in un dato istante (gestisce ora legale)
function romeOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ROME_TZ,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUTC = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return asUTC - Math.floor(date.getTime() / 1000) * 1000;
}

// Istante (UTC) in cui e' iniziato il giorno corrente a Roma (mezzanotte di Roma)
export function startOfTodayRome(date: Date = new Date()): Date {
  const [y, m, d] = todayRomeISO(date).split("-").map(Number);
  const midnightAsUTC = Date.UTC(y, m - 1, d);
  let instant = midnightAsUTC - romeOffsetMs(date);
  instant = midnightAsUTC - romeOffsetMs(new Date(instant)); // secondo passaggio: cambio ora legale
  return new Date(instant);
}

// Lunedi' (YYYY-MM-DD) della settimana corrente a Roma
export function mondayOfWeekRome(date: Date = new Date()): string {
  const [y, m, d] = todayRomeISO(date).split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d));
  const weekday = day.getUTCDay(); // 0 = domenica
  day.setUTCDate(day.getUTCDate() + (weekday === 0 ? -6 : 1 - weekday));
  return day.toISOString().slice(0, 10);
}

export type DuelsPhase = "before" | "open" | "last-day";

export function getRomeDuelsPhase(date: Date = new Date()): DuelsPhase {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Rome",
    weekday: "short",
  }).format(date);

  if (weekday === "Sat") return "open";
  if (weekday === "Sun") return "last-day";
  return "before";
}
