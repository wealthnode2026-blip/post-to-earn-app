import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { NotificationBell } from "./notification-bell";

export async function UserNav({
  active,
}: {
  active: "home" | "arena" | "hall-of-fame" | "deposit" | "withdraw" | "market" | "support" | "admin";
}) {
  const items = [
    { href: "/home", key: "home" as const, label: "Home" },
    { href: "/arena", key: "arena" as const, label: "Arena" },
    { href: "/hall-of-fame", key: "hall-of-fame" as const, label: "Hall of Fame" },
    { href: "/support", key: "support" as const, label: "Ticket" },
    { href: "/deposit", key: "deposit" as const, label: "Depositi" },
    { href: "/withdraw", key: "withdraw" as const, label: "Prelievi" },
    { href: "/market", key: "market" as const, label: "Market" },
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
  }

  const tabs = isAdmin
    ? [...items, { href: "/admin/moderation", key: "admin" as const, label: "Admin" }]
    : items;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-pearl/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-sm items-center justify-between px-6 py-3">
          <Link href="/home" className="font-display text-base italic text-ink">
            Atelier
          </Link>
          {user && <NotificationBell items={notifications} />}
        </div>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur-md">
        <div
          className="mx-auto flex w-full max-w-sm items-stretch justify-around px-2 pt-2"
          style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
        >
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`mx-0.5 flex min-w-0 flex-1 flex-col items-center rounded-lg py-1.5 text-center text-[11px] font-medium transition-colors ${
                active === tab.key
                  ? tab.key === "admin"
                    ? "bg-gold/15 text-gold"
                    : "bg-accent/15 text-accent"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <span className="truncate px-1">{tab.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
