import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function FeedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <p className="font-display text-2xl italic text-ink">Bentornato in Atelier.</p>
      <p className="mt-2 text-sm text-ink-soft">
        Il feed e l&apos;upload della foto del giorno arrivano nel prossimo passaggio.
      </p>
    </div>
  );
}
