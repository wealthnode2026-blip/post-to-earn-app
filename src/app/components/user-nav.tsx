import Link from "next/link";

export function UserNav({ active }: { active: "feed" | "arena" }) {
  const items = [
    { href: "/feed", key: "feed" as const, label: "Feed" },
    { href: "/arena", key: "arena" as const, label: "Arena" },
  ];

  return (
    <nav className="mx-auto flex w-full max-w-sm justify-center gap-6 px-6 pt-8">
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
