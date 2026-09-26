import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { TicketThreadAdmin } from "./ticket-thread-admin";

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, subject, status, profiles!support_tickets_user_id_fkey(username)")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const profile = Array.isArray(ticket.profiles) ? ticket.profiles[0] : ticket.profiles;

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, sender, message, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">{ticket.subject}</h1>
      <p className="mt-1 mb-6 text-sm text-ink-soft">
        {profile?.username ?? "utente"} · stato: {ticket.status}
      </p>

      <TicketThreadAdmin
        ticketId={ticket.id}
        initialMessages={messages ?? []}
        closed={ticket.status === "closed"}
      />
    </div>
  );
}
