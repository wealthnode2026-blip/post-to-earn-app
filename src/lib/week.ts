export function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = domenica ... 6 = sabato
  const diff = (day === 0 ? -6 : 1) - day; // porta al lunedì
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
