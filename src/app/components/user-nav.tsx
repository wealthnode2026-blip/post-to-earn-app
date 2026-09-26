import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { NotificationBell } from "./notification-bell";

export async function UserNav({
  active,
}: {
  active: "feed" | "arena" | "hall-of-fame" | "deposit" | "support";
}) {
  const items = [
    { href: "/feed", key: "feed" as const, label: "Feed" },
    { href: "/arena", key: "arena" as const, label: "Arena" },
    { href: "/hall-of-fame", key: "hall-of-fame" as const, label: "Hall of Fame" },
    { href: "/deposit", key: "deposit" as const, label: "Deposita" },
    { href: "/support", key: "support" as const, label: "Supporto" },
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

  if (user) {
    const { data } = await supabase
      .from("notifications")
      .select("id, message, link, is_read, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    notifications = data ?? [];
  }

  return (
    <nav className="mx-auto flex w-full max-w-sm flex-wrap items-center justify-center gap-5 px-6 pt-8">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`text-sm font-medium ${
            active === item.key ? "text-ink" : "text-ink-soft hover:text-ink"
          }`}
        >
          {item.label}
        </Link>
      ))}
      {user && <NotificationBell items={notifications} />}
    </nav>
  );
}
