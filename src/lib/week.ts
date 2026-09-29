import { mondayOfWeekRome } from "@/utils/date";

// Lunedi' della settimana (fuso di Roma), formato YYYY-MM-DD
export function getWeekStart(date = new Date()): string {
  return mondayOfWeekRome(date);
}
