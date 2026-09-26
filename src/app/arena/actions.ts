"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitVote(duelId: string, choice: "a" | "b") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, is_banned")
    .eq("id", user.id)
    .single();

  if (!profile || profile.plan === "free") {
    throw new Error("Solo gli utenti Pro/Master possono votare");
  }
  if (profile.is_banned) throw new Error("Account sospeso");

  const { data: duel } = await supabase
    .from("duels")
    .select("id, photo_a_id, photo_b_id, votes_a, votes_b, status")
    .eq("id", duelId)
    .single();

  if (!duel || duel.status !== "active") throw new Error("Duello non disponibile");

  const { data: photos } = await supabase
    .from("posts")
    .select("id, user_id")
    .in("id", [duel.photo_a_id, duel.photo_b_id]);

  if ((photos ?? []).some((p) => p.user_id === user.id)) {
    throw new Error("Non puoi votare un duello con una tua foto");
  }

  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("duel_id", duelId)
    .eq("voter_id", user.id)
    .maybeSingle();

  if (existingVote) throw new Error("Hai già votato questo duello");

  const votedFor = choice === "a" ? duel.photo_a_id : duel.photo_b_id;

  await supabase.from("votes").insert({ duel_id: duelId, voter_id: user.id, voted_for: votedFor });

  await supabase
    .from("duels")
    .update(choice === "a" ? { votes_a: duel.votes_a + 1 } : { votes_b: duel.votes_b + 1 })
    .eq("id", duelId);

  revalidatePath("/arena");
}
