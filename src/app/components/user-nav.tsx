import Link from "next/link";
import { redirect } from "next/navigation";
import type { CSSProperties } from "react";
import { createClient } from "@/utils/supabase/server";
import { NotificationBell } from "./notification-bell";

type IconProps = { className?: string; style?: CSSProperties };

function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 11v5.5M12 8v.01" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArenaIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 5H4v1a4 4 0 0 0 4 4M17 5h3v1a4 4 0 0 1-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 17h4M12 13v4M9 20h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path
        d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4V9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 7v10" strokeLinecap="round" strokeDasharray="1.5 2" />
    </svg>
  );
}

function DepositIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  );
}

function WithdrawIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 20V9m0 0 4 4m-4-4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 5h16" strokeLinecap="round" />
    </svg>
  );
}

function MarketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M5 9h14l-1 11H6L5 9Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AdminIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
      <path d="M12 3 5 6v5c0 4.5 3 7.7 7 9 4-1.3 7-4.5 7-9V6l-7-3Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 12 2 2 3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function UserNav({
  active,
}: {
  active: "info" | "home" | "arena" | "deposit" | "withdraw" | "market" | "support" | "admin";
}) {
  const items = [
    { href: "/info", key: "info" as const, label: "Info", Icon: InfoIcon },
    { href: "/home", key: "home" as const, label: "Home", Icon: HomeIcon },
    { href: "/arena", key: "arena" as const, label: "Arena", Icon: ArenaIcon },
    { href: "/support", key: "support" as const, label: "Ticket", Icon: TicketIcon },
    { href: "/deposit", key: "deposit" as const, label: "Depositi", Icon: DepositIcon },
    { href: "/withdraw", key: "withdraw" as const, label: "Prelievi", Icon: WithdrawIcon },
    { href: "/market", key: "market" as const, label: "Market", Icon: MarketIcon },
  ];

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let notifications: {
    id: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
  }[] = [];
  let isAdmin = false;
  let adminPendingCount = 0;

  if (user) {
    const [{ data: notifData }, { data: profile }] = await Promise.all([
      supabase
        .from("notifications")
        .select("id, message, link, is_read, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
    ]);
    notifications = notifData ?? [];
    isAdmin = profile?.is_admin ?? false;

    if (isAdmin) {
      const [pendingPosts, openTickets, pendingDeposits, pendingWithdrawals] = await Promise.all([
        supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase
          .from("support_tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "open"),
        supabase
          .from("crypto_transactions")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("withdrawal_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
      ]);
      adminPendingCount =
        (pendingPosts.count ?? 0) +
        (openTickets.count ?? 0) +
        (pendingDeposits.count ?? 0) +
        (pendingWithdrawals.count ?? 0);
    }
  }

  const tabs = isAdmin
    ? [...items, { href: "/admin/moderation", key: "admin" as const, label: "Admin", Icon: AdminIcon }]
    : items;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-pearl/85 backdrop-blur-md">
        <div
          className="mx-auto flex w-full max-w-sm items-center justify-between px-6 py-3"
          style={{ paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }}
        >
          <Link href="/home" className="text-ink">
            <span
              style={{
                fontFamily: "var(--font-script)",
                fontSize: "26px",
                color: "#ffffff",
                textShadow:
                  "0 0 6px #ffffff, 0 0 16px var(--color-coral), 0 0 32px var(--color-violet)",
              }}
            >
              Atelier
            </span>
          </Link>
          {user && (
            <div className="flex items-center gap-3">
              <NotificationBell items={notifications} />
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-xs font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Esci
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur-md">
        <div
          className="mx-auto flex w-full max-w-sm items-stretch justify-around px-1 pt-2"
          style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
        >
          {tabs.map((tab) => {
            const isActive = active === tab.key;
            const isGold = tab.key === "admin";
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg py-1 text-center transition-colors ${
                  isActive ? "text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                <span className="relative">
                  <tab.Icon
                    className="h-5 w-5"
                    style={
                      isActive
                        ? {
                            color: isGold ? "var(--color-gold)" : "var(--color-violet)",
                            filter: isGold
                              ? "drop-shadow(0 0 6px rgba(255,207,77,0.9))"
                              : "drop-shadow(0 0 6px rgba(168,85,247,0.9))",
                          }
                        : undefined
                    }
                  />
                  {isGold && adminPendingCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
                      {adminPendingCount > 99 ? "99+" : adminPendingCount}
                    </span>
                  )}
                </span>
                <span className="max-w-full truncate px-0.5 text-[9px] font-medium leading-none">
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
