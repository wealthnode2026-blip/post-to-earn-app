"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitVote(duelId: string, choice: "a" | "b") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase.rpc("cast_vote", {
    p_duel_id: duelId,
    p_choice: choice,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/arena");
}
