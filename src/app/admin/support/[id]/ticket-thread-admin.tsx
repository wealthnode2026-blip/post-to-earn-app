"use client";

import { useTransition } from "react";
import { MessageThread } from "../../../support/message-thread";
import { sendAdminMessage, closeTicket } from "../actions";

type Message = {
  id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

export function TicketThreadAdmin({
  ticketId,
  initialMessages,
  closed,
}: {
  ticketId: string;
  initialMessages: Message[];
  closed: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <MessageThread
        messages={initialMessages}
        disabled={closed}
        onSend={(text) => sendAdminMessage(ticketId, text)}
      />
      {!closed && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => closeTicket(ticketId))}
          className="mt-4 rounded-full border border-line px-4 py-2 text-xs font-medium text-ink-soft hover:bg-pearl disabled:opacity-40"
        >
          Chiudi ticket
        </button>
      )}
    </div>
  );
}
