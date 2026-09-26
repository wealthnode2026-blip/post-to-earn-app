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

export async function sendAdminMessage(ticketId: string, message: string) {
  const { supabase, adminId } = await requireAdmin();

  if (!message.trim()) throw new Error("Il messaggio non può essere vuoto");

  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender: "admin",
    sender_id: adminId,
    message: message.trim(),
  });

  await supabase.from("support_tickets").update({ status: "answered" }).eq("id", ticketId);

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
}

export async function closeTicket(ticketId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("support_tickets").update({ status: "closed" }).eq("id", ticketId);
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
}
