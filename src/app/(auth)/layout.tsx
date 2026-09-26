export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-[28px] italic tracking-tight text-ink">
            Atelier
          </span>
          <p className="mt-2 text-sm text-ink-soft">
            Una foto al giorno. Un solo scatto conta.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-[0_1px_2px_rgba(28,35,51,0.04)]">
          {children}
        </div>
      </div>
    </div>
  );
}
