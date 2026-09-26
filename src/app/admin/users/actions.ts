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

export async function setUserBan(userId: string, banned: boolean) {
  const { supabase, adminId } = await requireAdmin();

  if (userId === adminId) throw new Error("Non puoi bannare te stesso");

  const { data: target } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (target?.is_admin) throw new Error("Non puoi bannare un altro admin");

  await supabase.from("profiles").update({ is_banned: banned }).eq("id", userId);

  revalidatePath("/admin/users");
}
