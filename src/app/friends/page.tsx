import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserNav } from "../components/user-nav";

export default async function FriendsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: friends } = await supabase
    .from("profiles")
    .select("id, username, created_at, referral_rewarded_at")
    .eq("referred_by", user.id)
    .order("created_at", { ascending: false });

  const list = friends ?? [];
  const rewardedCount = list.filter((f) => f.referral_rewarded_at !== null).length;

  return (
    <>
      <UserNav active="home" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <div className="mb-2 flex items-center justify-between">
          <h1 className="font-display text-2xl italic text-ink">I tuoi amici</h1>
          <Link href="/home" className="text-sm font-medium text-accent">
            ← Home
          </Link>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          {list.length === 0
            ? "Non hai ancora invitato nessuno."
            : `${list.length} amici invitati · ${rewardedCount} bonus ricevuti (0.25 USDT ciascuno)`}
        </p>

        <div className="mt-8 space-y-3">
          {list.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{friend.username ?? "—"}</p>
                <p className="text-xs text-ink-soft">
                  Iscritto il {new Date(friend.created_at).toLocaleDateString("it-IT")}
                </p>
              </div>
              {friend.referral_rewarded_at ? (
                <span className="shrink-0 rounded-full border border-neon/20 bg-neon-soft px-2.5 py-1 text-xs font-medium text-neon-ink">
                  +0.25 USDT
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-soft">
                  In attesa
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
