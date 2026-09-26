import { createClient } from "@/utils/supabase/server";
import { ModerationCard } from "./moderation-card";

export default async function ModerationPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("id, image_path, created_at, profiles!posts_user_id_fkey(username)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const items = await Promise.all(
    (posts ?? []).map(async (post) => {
      const { data: signed } = await supabase.storage
        .from("daily-photos")
        .createSignedUrl(post.image_path, 3600);

      const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;

      return {
        id: post.id,
        username: profile?.username ?? "utente",
        imageUrl: signed?.signedUrl ?? null,
      };
    })
  );

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Coda di moderazione</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {items.length === 0
          ? "Nessuna foto in attesa al momento."
          : `${items.length} foto in attesa di revisione.`}
      </p>

      {items.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3">
          {items.map((item) => (
            <ModerationCard
              key={item.id}
              postId={item.id}
              username={item.username}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
