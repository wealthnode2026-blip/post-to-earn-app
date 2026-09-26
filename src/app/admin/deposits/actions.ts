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

export async function approveDeposit(txId: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: tx } = await supabase
    .from("crypto_transactions")
    .select("id, user_id, amount_usdt, status")
    .eq("id", txId)
    .single();

  if (!tx || tx.status !== "pending") return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("money_balance")
    .eq("id", tx.user_id)
    .single();

  await supabase
    .from("crypto_transactions")
    .update({ status: "approved", reviewed_by: adminId, reviewed_at: new Date().toISOString() })
    .eq("id", txId);

  await supabase
    .from("profiles")
    .update({ money_balance: (profile?.money_balance ?? 0) + Number(tx.amount_usdt) })
    .eq("id", tx.user_id);

  revalidatePath("/admin/deposits");
}

export async function rejectDeposit(txId: string, note: string) {
  const { supabase, adminId } = await requireAdmin();

  await supabase
    .from("crypto_transactions")
    .update({
      status: "rejected",
      admin_note: note || null,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", txId)
    .eq("status", "pending");

  revalidatePath("/admin/deposits");
}
