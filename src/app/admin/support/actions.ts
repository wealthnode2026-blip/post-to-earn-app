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

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("user_id, subject")
    .eq("id", ticketId)
    .single();

  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender: "admin",
    sender_id: adminId,
    message: message.trim(),
  });

  await supabase.from("support_tickets").update({ status: "answered" }).eq("id", ticketId);

  if (ticket) {
    await supabase.rpc("create_notification", {
      p_user_id: ticket.user_id,
      p_message: `Nuova risposta al ticket "${ticket.subject}"`,
      p_link: `/support/${ticketId}`,
    });
  }

  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
}

export async function closeTicket(ticketId: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("support_tickets").update({ status: "closed" }).eq("id", ticketId);
  revalidatePath(`/admin/support/${ticketId}`);
  revalidatePath("/admin/support");
}

export async function adminCreateTicket(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  const userId = String(formData.get("user_id") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!userId || !subject || !message) {
    throw new Error("Seleziona un utente e compila oggetto e messaggio");
  }

  const { error } = await supabase.rpc("admin_create_ticket", {
    p_admin_id: adminId,
    p_user_id: userId,
    p_subject: subject,
    p_message: message,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
}

export async function adminBroadcast(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!subject || !body) {
    throw new Error("Compila oggetto e testo dell'annuncio");
  }

  const { error } = await supabase.rpc("admin_broadcast_announcement", {
    p_admin_id: adminId,
    p_subject: subject,
    p_body: body,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/support");
}
