import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../../components/user-nav";
import { TicketThreadClient } from "./ticket-thread-client";

export default async function SupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: ticket } = await supabase
    .from("support_tickets")
    .select("id, subject, status, user_id")
    .eq("id", id)
    .single();

  if (!ticket || ticket.user_id !== user.id) notFound();

  const { data: messages } = await supabase
    .from("ticket_messages")
    .select("id, sender, message, created_at")
    .eq("ticket_id", id)
    .order("created_at", { ascending: true });

  return (
    <>
      <UserNav active="support" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-xl italic text-ink mb-1">{ticket.subject}</h1>
        <p className="mb-6 text-xs text-ink-soft capitalize">Stato: {ticket.status}</p>

        <TicketThreadClient
          ticketId={ticket.id}
          initialMessages={messages ?? []}
          closed={ticket.status === "closed"}
        />
      </div>
    </>
  );
}
