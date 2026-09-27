import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { startOfTodayUTC } from "@/utils/date";
import { UploadForm } from "./upload-form";
import { UserNav } from "../components/user-nav";
import { PhotoCard } from "../components/photo-card";
import { InstallAppButton } from "../components/install-app-button";
import { InviteLinkCard } from "../components/invite-link-card";
import { HowItWorks } from "../components/how-it-works";

const STATUS_LABEL: Record<string, string> = {
  pending: "In attesa di moderazione",
  approved: "Approvata",
  rejected: "Non approvata",
};

const STATUS_HINT: Record<string, string> = {
  pending: "Un admin la sta revisionando. Ti aggiorneremo qui appena decisa.",
  approved: "Hai guadagnato i tuoi micro-crediti per oggi. Torna domani per il prossimo scatto.",
  rejected: "Questo scatto non è stato accettato. Puoi riprovare domani.",
};

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-gold-soft text-gold-ink border border-gold/20",
  approved: "bg-neon-soft text-neon-ink border border-neon/20",
  rejected: "bg-red-950 text-red-300 border border-red-800/50",
};

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, plan, money_balance, bonus_balance")
    .eq("id", user.id)
    .single();

  const { data: plans } = await supabase
    .from("camera_plans")
    .select("plan_type, name, price_usdt, roll_price_usdt, credits_per_photo")
    .eq("active", true)
    .order("price_usdt", { ascending: true });

  const todayStart = startOfTodayUTC().toISOString();

  const { data: todaysPost } = await supabase
    .from("posts")
    .select("id, status, image_path")
    .eq("user_id", user.id)
    .gte("created_at", todayStart)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let imageUrl: string | null = null;
  if (todaysPost) {
    const { data: signed } = await supabase.storage
      .from("daily-photos")
      .createSignedUrl(todaysPost.image_path, 3600);
    imageUrl = signed?.signedUrl ?? null;
  }

  // Vetrina di oggi: tutte le foto approvate caricate oggi
  const { data: approvedToday } = await supabase
    .from("posts")
    .select("id, user_id, image_path, created_at")
    .eq("status", "approved")
    .gte("created_at", todayStart)
    .order("created_at", { ascending: false });

  let gallery: { id: string; username: string; imageUrl: string | null }[] = [];

  if (approvedToday && approvedToday.length > 0) {
    const paths = approvedToday.map((p) => p.image_path);
    const userIds = Array.from(new Set(approvedToday.map((p) => p.user_id)));

    const [{ data: signedUrls }, { data: profiles }] = await Promise.all([
      supabase.storage.from("daily-photos").createSignedUrls(paths, 3600),
      supabase.from("profiles").select("id, username").in("id", userIds),
    ]);

    const urlByPath = new Map(
      (signedUrls ?? []).map((s) => [s.path, s.signedUrl])
    );
    const usernameById = new Map(
      (profiles ?? []).map((p) => [p.id, p.username])
    );

    gallery = approvedToday.map((p) => ({
      id: p.id,
      username: usernameById.get(p.user_id) ?? "Fotografo",
      imageUrl: urlByPath.get(p.image_path) ?? null,
    }));
  }

  return (
    <>
      <UserNav active="home" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-display text-xl italic text-ink">
              Ciao, {profile?.username ?? "fotografo"}
            </p>
            <p className="text-sm text-ink-soft capitalize">Piano {profile?.plan ?? "free"}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="rounded-full border border-accent/20 bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-ink">
              <span className="font-mono">{profile?.money_balance ?? 0}</span> USDT
            </div>
            {(profile?.bonus_balance ?? 0) > 0 && (
              <div
                className="flex items-center gap-1 rounded-full border border-gold/30 bg-gold-soft px-3 py-1 text-xs font-medium text-gold-ink"
                title="Saldo di prova: diventa prelevabile solo dopo l'acquisto di un rullino"
              >
                <span>⚠️</span>
                <span className="font-mono">{profile?.bonus_balance}</span>
                <span>saldo prova</span>
              </div>
            )}
          </div>
        </div>

        <InviteLinkCard username={profile?.username ?? ""} />

        <HowItWorks plans={plans ?? []} />

        <div className="mb-6 flex justify-end">
          <InstallAppButton />
        </div>

        {todaysPost ? (
          <PhotoCard
            imageUrl={imageUrl}
            alt="Il tuo scatto di oggi"
            badge={
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[todaysPost.status]}`}
              >
                {STATUS_LABEL[todaysPost.status]}
              </span>
            }
            footer={<p className="text-sm text-ink-soft">{STATUS_HINT[todaysPost.status]}</p>}
          />
        ) : (
          <UploadForm />
        )}
      </div>

      <div className="mx-auto w-full max-w-4xl px-6 pb-16">
        <h2 className="mb-6 font-display text-lg italic text-ink">
          La mostra di oggi
        </h2>

        {gallery.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Nessuna foto approvata ancora oggi. Torna più tardi.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {gallery.map((item) => (
              <PhotoCard
                key={item.id}
                imageUrl={item.imageUrl}
                alt={`Scatto di ${item.username}`}
                footer={
                  <p className="truncate text-sm font-medium text-ink">
                    {item.username}
                  </p>
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
