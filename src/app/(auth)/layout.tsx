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

        <div className="rounded-lg border border-line bg-surface p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
