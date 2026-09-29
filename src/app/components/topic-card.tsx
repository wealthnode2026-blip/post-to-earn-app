export function TopicCard({
  title,
  description,
}: {
  title: string | null;
  description?: string | null;
}) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-lg border border-accent/30 bg-gradient-to-br from-surface-raised to-surface p-6 shadow-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
      />
      <p className="relative text-xs font-medium uppercase tracking-[0.2em] text-accent">
        Tema di oggi
      </p>
      {title ? (
        <>
          <h2 className="relative mt-3 font-display text-3xl italic leading-tight text-ink">
            {title}
          </h2>
          {description && (
            <p className="relative mt-3 text-sm leading-relaxed text-ink-soft">{description}</p>
          )}
        </>
      ) : (
        <p className="relative mt-3 font-display text-xl italic text-ink-soft">
          Tema libero: scatta ciò che ti ispira.
        </p>
      )}
    </section>
  );
}
