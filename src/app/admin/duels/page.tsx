import { createClient } from "@/utils/supabase/server";
import { getWeekStart } from "@/lib/week";
import { WeekControls } from "./week-controls";

export default async function DuelsPage() {
  const supabase = await createClient();
  const weekStart = getWeekStart();

  const { data: duels } = await supabase
    .from("duels")
    .select(
      "id, votes_a, votes_b, status, photo_a:posts!duels_photo_a_id_fkey(id, image_path), photo_b:posts!duels_photo_b_id_fkey(id, image_path)"
    )
    .eq("week_start", weekStart);

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Arena dei Duelli</h1>
      <p className="mt-1 text-sm text-ink-soft">Settimana corrente: {weekStart}</p>

      <div className="mt-6">
        <WeekControls />
      </div>

      <p className="text-sm text-ink-soft">
        {duels?.length ?? 0} duelli generati per questa settimana.
      </p>

      {duels && duels.length > 0 && (
        <div className="mt-6 space-y-2">
          {duels.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm"
            >
              <span className="text-ink-soft">Duello {d.id.slice(0, 8)}</span>
              <span className="text-ink">
                A: {d.votes_a} voti · B: {d.votes_b} voti
              </span>
              <span className="text-ink-soft capitalize">{d.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
