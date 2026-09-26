import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getWeekStart } from "@/lib/week";
import { getRomeDuelsPhase } from "@/utils/date";
import { DuelCard } from "./duel-card";
import { DuelBanner } from "./duel-banner";
import { UserNav } from "../components/user-nav";

export default async function ArenaPage() {
  const supabase = await createClient();
  const weekStart = getWeekStart();
  const phase = getRomeDuelsPhase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const { data: prizeSetting } = await supabase
    .from("app_settings")
    .select("value")
    .eq("key", "duel_prize")
    .single();

  const prize = prizeSetting?.value ?? "";

  if (!profile || profile.plan === "free") {
    return (
      <>
        <UserNav active="arena" />
        <div>
        <h1 className="font-display text-2xl italic text-ink">Arena dei Duelli</h1>
        <div className="mt-6">
          <DuelBanner phase={phase} prize={prize} />
        </div>
        <p className="mt-3 text-sm text-ink-soft">
          L&apos;Arena è riservata agli utenti Pro e Master. Passa a un piano superiore per
          partecipare e votare.
        </p>
        </div>
      </>
    );
  }

  const { data: duels } = await supabase
    .from("duels")
    .select("id, photo_a_id, photo_b_id")
    .eq("week_start", weekStart)
    .eq("status", "active");

  const { data: myVotes } = await supabase
    .from("votes")
    .select("duel_id")
    .eq("voter_id", user.id);

  const votedIds = new Set((myVotes ?? []).map((v) => v.duel_id));

  const photoIds = (duels ?? []).flatMap((d) => [d.photo_a_id, d.photo_b_id]);
  const { data: photos } = await supabase
    .from("posts")
    .select("id, user_id, image_path")
    .in("id", photoIds.length > 0 ? photoIds : ["00000000-0000-0000-0000-000000000000"]);

  const photoMap = new Map((photos ?? []).map((p) => [p.id, p]));

  const eligibleDuels = (duels ?? []).filter((d) => {
    if (votedIds.has(d.id)) return false;
    const a = photoMap.get(d.photo_a_id);
    const b = photoMap.get(d.photo_b_id);
    if (!a || !b) return false;
    return a.user_id !== user.id && b.user_id !== user.id;
  });

  const items = await Promise.all(
    eligibleDuels.map(async (d) => {
      const a = photoMap.get(d.photo_a_id)!;
      const b = photoMap.get(d.photo_b_id)!;
      const [signedA, signedB] = await Promise.all([
        supabase.storage.from("daily-photos").createSignedUrl(a.image_path, 3600),
        supabase.storage.from("daily-photos").createSignedUrl(b.image_path, 3600),
      ]);
      return {
        id: d.id,
        imageA: signedA.data?.signedUrl ?? null,
        imageB: signedB.data?.signedUrl ?? null,
      };
    })
  );

  return (
    <>
      <UserNav active="arena" />
      <div>
      <h1 className="font-display text-2xl italic text-ink">Arena dei Duelli</h1>

      <div className="mt-6">
        <DuelBanner phase={phase} prize={prize} />
      </div>

      <p className="text-sm text-ink-soft">
        {items.length === 0
          ? "Nessun duello da votare al momento."
          : `${items.length} duelli da votare — scegli la tua foto preferita.`}
      </p>

      {items.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <DuelCard key={item.id} duelId={item.id} imageA={item.imageA} imageB={item.imageB} />
          ))}
        </div>
      )}
      </div>
    </>
  );
}
