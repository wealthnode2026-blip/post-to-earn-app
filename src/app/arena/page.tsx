import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { PhotoCard } from "../components/photo-card";

// Nota interna: Arena disattivata finche' la community non e' abbastanza numerosa
// da rendere il voto interessante. Il codice precedente (matchmaking a coppie, voto
// cieco, banner countdown) resta in repo, solo scollegato dal routing pubblico.
export default async function ArenaPage() {
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
      <UserNav active="arena" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-2xl italic text-ink">Arena dei Duelli</h1>
        <p className="mt-2 text-sm font-medium text-accent-ink">Arriva presto</p>

        <div className="mt-8 rounded-lg border border-line bg-surface p-5">
          <p className="text-sm text-ink">Come funzionerà</p>
          <ul className="mt-3 space-y-3 text-sm text-ink-soft">
            <li>
              Ogni <span className="text-ink">sabato</span> tutte le foto approvate della
              settimana entrano in gara nell&apos;Arena.
            </li>
            <li>
              Tutti gli utenti con un <span className="text-ink">rullino attivo</span> possono
              votare la foto che preferiscono tra tutte quelle in gara.
            </li>
            <li>
              Le votazioni chiudono la <span className="text-ink">domenica sera</span>. La foto
              più votata entra nella <span className="text-ink">Hall of Fame</span> per sempre, e
              chi l&apos;ha scattata riceve anche un premio in{" "}
              <span className="text-ink">USDT</span>.
            </li>
          </ul>
        </div>

        <h2 className="mt-10 mb-4 font-display text-lg italic text-ink">Hall of Fame</h2>
        {items.length === 0 ? (
          <div className="rounded-lg border border-gold/20 bg-gold-soft p-5">
            <p className="text-sm text-ink">
              Qui troverai, per sempre, la foto più votata di ogni settimana.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
