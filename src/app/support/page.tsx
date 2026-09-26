import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";
import { NewTicketForm } from "./new-ticket-form";

const STATUS_LABEL: Record<string, string> = {
  open: "Aperto",
  answered: "Risposto",
  closed: "Chiuso",
};

export default async function SupportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, subject, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <UserNav active="support" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-xl italic text-ink mb-6">Supporto</h1>

        <NewTicketForm />

        {tickets && tickets.length > 0 && (
          <div className="mt-8 space-y-2">
            <p className="text-xs font-medium text-ink-soft">I tuoi ticket</p>
            {tickets.map((t) => (
              <Link
                key={t.id}
                href={`/support/${t.id}`}
                className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm hover:bg-pearl"
              >
                <span className="text-ink">{t.subject}</span>
                <span className="text-xs text-ink-soft">{STATUS_LABEL[t.status]}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
