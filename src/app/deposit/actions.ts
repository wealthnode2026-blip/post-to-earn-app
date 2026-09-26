"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitDeposit(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const txid = String(formData.get("txid") ?? "").trim();
  const amount = Number(formData.get("amount_usdt") ?? 0);

  if (!txid) throw new Error("Il TXID è obbligatorio");
  if (!amount || amount <= 0) throw new Error("Inserisci un importo valido");

  const { data: existing } = await supabase
    .from("crypto_transactions")
    .select("id")
    .eq("txid", txid)
    .maybeSingle();

  if (existing) throw new Error("Questo TXID è già stato inviato in precedenza");

  await supabase.from("crypto_transactions").insert({
    user_id: user.id,
    txid,
    amount_usdt: amount,
    status: "pending",
  });

  revalidatePath("/deposit");
}
