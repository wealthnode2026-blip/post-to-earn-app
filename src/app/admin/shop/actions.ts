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

  return { supabase };
}

export async function createCameraPlan(formData: FormData) {
  const { supabase } = await requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  const plan_type = String(formData.get("plan_type") ?? "free");
  const multiplier = Number(formData.get("multiplier") ?? 1);
  const price_usdt = Number(formData.get("price_usdt") ?? 0);

  if (!name) throw new Error("Il nome è obbligatorio");

  await supabase.from("camera_plans").insert({
    name,
    plan_type,
    multiplier,
    price_usdt,
    active: true,
  });

  revalidatePath("/admin/shop");
}

export async function updateCameraPlan(
  id: string,
  updates: { name?: string; multiplier?: number; price_usdt?: number }
) {
  const { supabase } = await requireAdmin();
  await supabase.from("camera_plans").update(updates).eq("id", id);
  revalidatePath("/admin/shop");
}

export async function toggleCameraPlanActive(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("camera_plans").update({ active }).eq("id", id);
  revalidatePath("/admin/shop");
}

export async function deleteCameraPlan(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("camera_plans").delete().eq("id", id);
  revalidatePath("/admin/shop");
}
