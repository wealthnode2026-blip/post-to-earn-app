import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const NAV = [
  { href: "/admin/moderation", label: "Moderazione" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/shop", label: "Shop" },
  { href: "/admin/duels", label: "Duelli" },
  { href: "/admin/deposits", label: "Depositi" },
  { href: "/admin/withdrawals", label: "Prelievi" },
  { href: "/admin/support", label: "Supporto" },
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

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <span className="font-display text-lg italic text-ink">Atelier — Admin</span>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
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
