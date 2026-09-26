import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { PhotoCard } from "../components/photo-card";

export default async function HallOfFamePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: winners } = await supabase
    .from("hall_of_fame")
    .select("id, week_start, votes_received, image_path, user_id, profiles(username)")
    .order("week_start", { ascending: false });

  const items = await Promise.all(
    (winners ?? []).map(async (w) => {
      const profile = Array.isArray(w.profiles) ? w.profiles[0] : w.profiles;
      const signed = await supabase.storage
        .from("daily-photos")
        .createSignedUrl(w.image_path, 3600);
      return {
        id: w.id,
        weekStart: w.week_start,
        votes: w.votes_received,
        username: profile?.username ?? "Utente",
        imageUrl: signed.data?.signedUrl ?? null,
      };
    })
  );

  return (
    <>
      <UserNav active="hall-of-fame" />
      <div>
        <h1 className="font-display text-2xl italic text-ink">Hall of Fame</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {items.length === 0
            ? "Nessun vincitore ancora — la prima settimana è in corso."
            : "Le foto vincitrici di ogni settimana, per sempre."}
        </p>

        {items.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <PhotoCard
                key={item.id}
                imageUrl={item.imageUrl}
                aspect="aspect-square"
                gold
                footer={
                  <>
                    <p className="text-sm font-medium text-ink">{item.username}</p>
                    <p className="text-xs text-ink-soft">
                      Settimana del {item.weekStart} · {item.votes} voti
                    </p>
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
