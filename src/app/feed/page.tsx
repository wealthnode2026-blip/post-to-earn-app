import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { startOfTodayUTC } from "@/utils/date";
import { UploadForm } from "./upload-form";
import { UserNav } from "../components/user-nav";

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

export default async function FeedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, plan, credit_balance")
    .eq("id", user.id)
    .single();

  const { data: todaysPost } = await supabase
    .from("posts")
    .select("id, status, image_path")
    .eq("user_id", user.id)
    .gte("created_at", startOfTodayUTC().toISOString())
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

  return (
    <>
      <UserNav active="feed" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="font-display text-xl italic text-ink">
            Ciao, {profile?.username ?? "fotografo"}
          </p>
          <p className="text-sm text-ink-soft capitalize">Piano {profile?.plan ?? "free"}</p>
        </div>
        <div className="rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent-ink">
          {profile?.credit_balance ?? 0} crediti
        </div>
      </div>

      {todaysPost ? (
        <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Il tuo scatto di oggi" className="aspect-[4/5] w-full object-cover" />
          )}
          <div className="p-5">
            <p className="text-sm font-medium text-ink">{STATUS_LABEL[todaysPost.status]}</p>
            <p className="mt-1 text-sm text-ink-soft">{STATUS_HINT[todaysPost.status]}</p>
          </div>
        </div>
      ) : (
        <UploadForm />
      )}
    </div>
    </>
  );
}
