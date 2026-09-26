"use client";

import { MessageThread } from "../message-thread";
import { sendUserMessage } from "../actions";

type Message = {
  id: string;
  sender: "user" | "admin";
  message: string;
  created_at: string;
};

export function TicketThreadClient({
  ticketId,
  initialMessages,
  closed,
}: {
  ticketId: string;
  initialMessages: Message[];
  closed: boolean;
}) {
  return (
    <MessageThread
      messages={initialMessages}
      disabled={closed}
      onSend={(text) => sendUserMessage(ticketId, text)}
    />
  );
}
