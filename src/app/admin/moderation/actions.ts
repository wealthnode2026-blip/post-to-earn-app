"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

const BASE_DAILY_CREDITS = 10; // credito base al giorno, moltiplicato per il piano dell'utente

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

  return { supabase, adminId: user.id };
}

export async function approvePost(postId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("id, user_id, status")
    .eq("id", postId)
    .single();

  if (!post || post.status !== "pending") return;

  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("multiplier, credit_balance")
    .eq("id", post.user_id)
    .single();

  const multiplier = authorProfile?.multiplier ?? 1;
  const creditsAwarded = BASE_DAILY_CREDITS * multiplier;

  await supabase
    .from("posts")
    .update({
      status: "approved",
      credits_awarded: creditsAwarded,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", postId);

  await supabase
    .from("profiles")
    .update({
      credit_balance: (authorProfile?.credit_balance ?? 0) + creditsAwarded,
    })
    .eq("id", post.user_id);

  revalidatePath("/admin/moderation");
  revalidatePath("/feed");
}

export async function rejectPost(postId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("id, image_path, status")
    .eq("id", postId)
    .single();

  if (!post || post.status !== "pending") return;

  await supabase
    .from("posts")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", postId);

  // La foto scartata viene rimossa dallo storage (coerente con l'obiettivo costo zero)
  await supabase.storage.from("daily-photos").remove([post.image_path]);

  revalidatePath("/admin/moderation");
  revalidatePath("/feed");
}
