import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

type NavItem = { href: string; label: string; countKey?: "posts" | "tickets" | "deposits" | "withdrawals" };

const NAV: NavItem[] = [
  { href: "/admin/moderation", label: "Moderazione", countKey: "posts" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/duels", label: "Duelli" },
  { href: "/admin/deposits", label: "Depositi", countKey: "deposits" },
  { href: "/admin/withdrawals", label: "Prelievi", countKey: "withdrawals" },
  { href: "/admin/support", label: "Supporto", countKey: "tickets" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/home");

  const [pendingPosts, openTickets, pendingDeposits, pendingWithdrawals] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("crypto_transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("withdrawal_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const counts: Record<string, number> = {
    posts: pendingPosts.count ?? 0,
    tickets: openTickets.count ?? 0,
    deposits: pendingDeposits.count ?? 0,
    withdrawals: pendingWithdrawals.count ?? 0,
  };

  return (
    <div className="min-h-screen">
      <header
        className="border-b border-line bg-surface px-4 py-4 sm:px-6"
        style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}
      >
        <div className="mx-auto max-w-4xl">
          <span className="font-display text-lg italic text-ink">Atelier — Admin</span>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {NAV.map((item) => {
              const count = item.countKey ? counts[item.countKey] : 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
                >
                  {item.label}
                  {count > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link href="/home" className="text-sm font-medium text-accent hover:opacity-80">
              Torna all&apos;app
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">{children}</main>
    </div>
  );
}
