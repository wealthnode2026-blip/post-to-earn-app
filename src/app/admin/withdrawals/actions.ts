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

export async function approveWithdrawal(id: string) {
  const { supabase, adminId } = await requireAdmin();

  await supabase
    .from("withdrawal_requests")
    .update({ status: "approved", reviewed_by: adminId, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending");

  revalidatePath("/admin/withdrawals");
}

export async function rejectWithdrawal(id: string, note: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.rpc("reject_withdrawal", {
    p_id: id,
    p_note: note || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/withdrawals");
}
