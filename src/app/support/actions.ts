"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!subject || !message) throw new Error("Oggetto e messaggio sono obbligatori");

  const { data: ticket, error } = await supabase
    .from("support_tickets")
    .insert({ user_id: user.id, subject, status: "open" })
    .select("id")
    .single();

  if (error || !ticket) throw new Error("Impossibile creare il ticket");

  await supabase.from("ticket_messages").insert({
    ticket_id: ticket.id,
    sender: "user",
    sender_id: user.id,
    message,
  });

  redirect(`/support/${ticket.id}`);
}

export async function sendUserMessage(ticketId: string, message: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  if (!message.trim()) throw new Error("Il messaggio non può essere vuoto");

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, user_id")
    .eq("id", ticketId)
    .single();

  if (!ticket || ticket.user_id !== user.id) throw new Error("Ticket non trovato");

  await supabase.from("ticket_messages").insert({
    ticket_id: ticketId,
    sender: "user",
    sender_id: user.id,
    message: message.trim(),
  });

  await supabase.from("support_tickets").update({ status: "open" }).eq("id", ticketId);

  revalidatePath(`/support/${ticketId}`);
}
