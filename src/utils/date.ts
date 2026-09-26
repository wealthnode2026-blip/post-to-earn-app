export function startOfTodayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export function mondayOfWeekUTC(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay(); // 0 = domenica
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
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
