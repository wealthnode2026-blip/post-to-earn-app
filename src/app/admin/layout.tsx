import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const NAV = [
  { href: "/admin/moderation", label: "Moderazione" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/duels", label: "Duelli" },
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

  if (!profile?.is_admin) redirect("/feed");

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-display text-lg italic text-ink">Atelier — Admin</span>
          <nav className="flex gap-5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/feed" className="text-sm font-medium text-ink-soft hover:text-ink">
              Torna all&apos;app
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
