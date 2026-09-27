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

export async function adminCreateTicket(formData: FormData) {
  const { supabase, adminId } = await requireAdmin();

  const username = String(formData.get("username") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!username || !subject || !message) {
    throw new Error("Compila utente, oggetto e messaggio");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .single();

  if (profileError || !profile) {
    throw new Error("Utente non trovato");
  }

  const { error } = await supabase.rpc("admin_create_ticket", {
    p_admin_id: adminId,
    p_user_id: profile.id,
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
