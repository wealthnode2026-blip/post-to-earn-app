"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function submitWithdrawal(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const amount = Number(formData.get("amount_usdt") ?? 0);
  const wallet = String(formData.get("wallet_address") ?? "").trim();

  if (!amount || amount <= 0) throw new Error("Inserisci un importo valido");
  if (!wallet) throw new Error("Inserisci l'indirizzo del wallet");

  const { error } = await supabase.rpc("request_withdrawal", {
    p_amount: amount,
    p_wallet: wallet,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/withdraw");
  revalidatePath("/home");
}
