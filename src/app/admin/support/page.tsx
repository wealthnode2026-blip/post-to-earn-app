import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const STATUS_LABEL: Record<string, string> = {
  open: "Aperto",
  answered: "Risposto",
  closed: "Chiuso",
};

const STATUS_ORDER: Record<string, number> = { open: 0, answered: 1, closed: 2 };

export default async function AdminSupportPage() {
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, subject, status, created_at, profiles!support_tickets_user_id_fkey(username)")
    .order("created_at", { ascending: false });

  const items = (tickets ?? [])
    .map((t) => {
      const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles;
      return {
        id: t.id,
        subject: t.subject,
        status: t.status,
        username: profile?.username ?? "utente",
      };
    })
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Ticket di supporto</h1>
      <p className="mt-1 text-sm text-ink-soft">{items.length} ticket totali.</p>

      <div className="mt-8 space-y-2">
        {items.map((t) => (
          <Link
            key={t.id}
            href={`/admin/support/${t.id}`}
            className="flex items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-sm hover:bg-pearl"
          >
            <span className="text-ink">{t.subject}</span>
            <span className="text-ink-soft">{t.username}</span>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                t.status === "open"
                  ? "bg-red-50 text-red-400"
                  : t.status === "answered"
                  ? "bg-green-50 text-green-600"
                  : "bg-pearl text-ink-soft"
              }`}
            >
              {STATUS_LABEL[t.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
