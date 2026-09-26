"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markNotificationRead } from "../notifications/actions";

type NotificationItem = {
  id: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export function NotificationBell({ items }: { items: NotificationItem[] }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(items);
  const [, startTransition] = useTransition();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  function handleClick(n: NotificationItem) {
    if (!n.is_read) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item))
      );
      startTransition(() => {
        markNotificationRead(n.id).catch(() => {});
      });
    }
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative text-sm font-medium text-ink-soft hover:text-ink"
        aria-label="Notifiche"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-xl border border-black/5 bg-white p-2 shadow-lg">
          {notifications.length === 0 ? (
            <p className="p-3 text-xs text-ink-soft">Nessuna notifica.</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-y-auto">
              {notifications.map((n) => {
                const content = (
                  <div
                    className={`rounded-lg p-3 text-xs ${
                      n.is_read ? "text-ink-soft" : "bg-accent/5 font-medium text-ink"
                    }`}
                  >
                    {n.message}
                  </div>
                );
                return (
                  <li key={n.id}>
                    {n.link ? (
                      <Link href={n.link} onClick={() => handleClick(n)}>
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => handleClick(n)}
                      >
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
