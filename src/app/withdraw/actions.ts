"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { isNetwork, isValidAddress } from "@/lib/networks";

export async function submitWithdrawal(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non autenticato" };

  const amount = Number(formData.get("amount_usdt") ?? 0);
  const wallet = String(formData.get("wallet_address") ?? "").trim();
  const network = String(formData.get("network") ?? "").trim();

  if (!amount || amount <= 0) return { error: "Inserisci un importo valido" };
  if (amount < 15) return { error: "Importo minimo prelevabile: 15 USDT" };
  if (!isNetwork(network)) return { error: "Scegli la rete su cui ricevere il prelievo" };
  if (!wallet) return { error: "Inserisci l'indirizzo del wallet" };
  if (!isValidAddress(network, wallet)) {
    return { error: "L'indirizzo non è valido per la rete selezionata. Controlla rete e indirizzo." };
  }

  const { error } = await supabase.rpc("request_withdrawal", {
    p_amount: amount,
    p_wallet: wallet,
    p_network: network,
  });

  if (error) return { error: error.message };

  revalidatePath("/withdraw");
  revalidatePath("/home");
  return {};
}
