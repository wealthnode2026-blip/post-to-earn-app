"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getWeekStart } from "@/lib/week";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Accesso negato");

  return { supabase };
}

export async function generateWeeklyDuels() {
  const { supabase } = await requireAdmin();
  const weekStart = getWeekStart();

  const { count } = await supabase
    .from("duels")
    .select("id", { count: "exact", head: true })
    .eq("week_start", weekStart);

  if (count && count > 0) {
    throw new Error("I duelli per questa settimana sono già stati generati");
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("id, user_id, profiles!posts_user_id_fkey(plan)")
    .eq("status", "approved")
    .eq("week_start", weekStart);

  const eligible = (posts ?? []).filter((p) => {
    const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    return profile?.plan && profile.plan !== "free";
  });

  const shuffled = [...eligible].sort(() => Math.random() - 0.5);

  const duelsToInsert = [];
  for (let i = 0; i + 1 < shuffled.length; i += 2) {
    duelsToInsert.push({
      week_start: weekStart,
      photo_a_id: shuffled[i].id,
      photo_b_id: shuffled[i + 1].id,
      status: "active" as const,
    });
  }

  if (duelsToInsert.length === 0) {
    throw new Error(
      "Non ci sono abbastanza foto idonee (servono foto approvate di utenti Pro/Master) per generare duelli"
    );
  }

  await supabase.from("duels").insert(duelsToInsert);

  revalidatePath("/admin/duels");
  revalidatePath("/arena");
}

export async function closeWeekAndCrownWinner() {
  const { supabase } = await requireAdmin();
  const weekStart = getWeekStart();

  const { data: duels } = await supabase
    .from("duels")
    .select("id, photo_a_id, photo_b_id, votes_a, votes_b")
    .eq("week_start", weekStart);

  if (!duels || duels.length === 0) {
    throw new Error("Nessun duello trovato per questa settimana");
  }

  const tally = new Map<string, number>();
  for (const d of duels) {
    tally.set(d.photo_a_id, (tally.get(d.photo_a_id) ?? 0) + d.votes_a);
    tally.set(d.photo_b_id, (tally.get(d.photo_b_id) ?? 0) + d.votes_b);
  }

  let winnerId: string | null = null;
  let winnerVotes = -1;
  for (const [postId, votes] of tally) {
    if (votes > winnerVotes) {
      winnerVotes = votes;
      winnerId = postId;
    }
  }

  if (!winnerId) throw new Error("Impossibile determinare un vincitore");

  const { data: winnerPost } = await supabase
    .from("posts")
    .select("id, user_id, image_path")
    .eq("id", winnerId)
    .single();

  if (!winnerPost) throw new Error("Foto vincitrice non trovata");

  await supabase.from("hall_of_fame").insert({
    week_start: weekStart,
    post_id: winnerPost.id,
    user_id: winnerPost.user_id,
    image_path: winnerPost.image_path,
    votes_received: winnerVotes,
  });

  await supabase.from("notifications").insert({
    user_id: winnerPost.user_id,
    message: `Hai vinto l'Arena dei Duelli della settimana del ${weekStart}! La tua foto è entrata nella Hall of Fame.`,
    link: "/hall-of-fame",
  });

  const duelIds = duels.map((d) => d.id);

  // Pulizia: rimuovi prima i voti, poi i duelli (per rispettare i vincoli di foreign key)
  await supabase.from("votes").delete().in("duel_id", duelIds);
  await supabase.from("duels").delete().in("id", duelIds);

  // Salva-Server: elimina tutte le altre foto della settimana da storage e DB
  const { data: weekPosts } = await supabase
    .from("posts")
    .select("id, image_path")
    .eq("week_start", weekStart)
    .neq("id", winnerPost.id);

  const pathsToRemove = (weekPosts ?? []).map((p) => p.image_path);
  if (pathsToRemove.length > 0) {
    await supabase.storage.from("daily-photos").remove(pathsToRemove);
  }

  await supabase.from("posts").delete().eq("week_start", weekStart).neq("id", winnerPost.id);

  revalidatePath("/admin/duels");
  revalidatePath("/arena");
  revalidatePath("/home");
}

export async function updateDuelPrize(prizeText: string) {
  const { supabase } = await requireAdmin();

  const trimmed = prizeText.trim();
  if (!trimmed) throw new Error("Il testo del premio non può essere vuoto");

  await supabase
    .from("app_settings")
    .update({ value: trimmed, updated_at: new Date().toISOString() })
    .eq("key", "duel_prize");

  revalidatePath("/admin/duels");
  revalidatePath("/arena");
}
