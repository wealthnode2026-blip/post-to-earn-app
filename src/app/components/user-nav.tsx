import Link from "next/link";

export function UserNav({
  active,
}: {
  active: "feed" | "arena" | "deposit" | "support";
}) {
  const items = [
    { href: "/feed", key: "feed" as const, label: "Feed" },
    { href: "/arena", key: "arena" as const, label: "Arena" },
    { href: "/deposit", key: "deposit" as const, label: "Deposita" },
    { href: "/support", key: "support" as const, label: "Supporto" },
  ];

  return (
    <nav className="mx-auto flex w-full max-w-sm justify-center gap-5 px-6 pt-8">
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
    </nav>
  );
}
