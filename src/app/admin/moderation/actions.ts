"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

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
    .select("id, user_id, status, is_trial")
    .eq("id", postId)
    .single();

  if (!post || post.status !== "pending") return;

  const { data: authorProfile } = await supabase
    .from("profiles")
    .select("plan, bonus_balance")
    .eq("id", post.user_id)
    .single();

  const { data: cameraPlan } = await supabase
    .from("camera_plans")
    .select("credits_per_photo")
    .eq("plan_type", authorProfile?.plan ?? "free")
    .single();

  const creditsAwarded = Number(cameraPlan?.credits_per_photo ?? 0.5);

  await supabase
    .from("posts")
    .update({
      status: "approved",
      credits_awarded: creditsAwarded,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminId,
    })
    .eq("id", postId);

  if (post.is_trial) {
    await supabase
      .from("profiles")
      .update({
        bonus_balance: Number(authorProfile?.bonus_balance ?? 0) + creditsAwarded,
      })
      .eq("id", post.user_id);
  } else {
    await supabase.rpc("award_credit", {
      p_user_id: post.user_id,
      p_amount: creditsAwarded,
    });
  }

  await supabase.rpc("create_notification", {
    p_user_id: post.user_id,
    p_message: `La tua foto è stata approvata! Hai guadagnato ${creditsAwarded} crediti.`,
    p_link: "/home",
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/home");
}

export async function rejectPost(postId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: post } = await supabase
    .from("posts")
    .select("id, image_path, status, user_id")
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

  await supabase.rpc("create_notification", {
    p_user_id: post.user_id,
    p_message: "La tua foto è stata rifiutata dalla moderazione.",
    p_link: "/home",
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/home");
}
