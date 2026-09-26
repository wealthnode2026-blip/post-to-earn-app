import { createClient } from "@/utils/supabase/server";

type Summary = {
  total_views: number;
  views_today: number;
  views_week: number;
  unique_visitors: number;
  unique_visitors_today: number;
  registered_views: number;
  anonymous_views: number;
  top_countries: { country: string; count: number }[];
  top_pages: { path: string; count: number }[];
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass">
      <div className="glass-inner">
        <p className="eyebrow text-xs text-ink-soft">{label}</p>
        <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_analytics_summary");
  const summary = (data ?? null) as Summary | null;

  return (
    <div>
      <h1 className="font-display text-2xl italic text-ink">Analytics</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Visite al sito, visitatori unici e provenienza geografica.
      </p>

      {error && (
        <p className="mt-6 rounded-md border border-line bg-surface px-3 py-2 text-xs text-red-400">
          Errore nel caricamento: {error.message}
        </p>
      )}

      {summary && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Visite totali" value={summary.total_views} />
            <StatCard label="Visite oggi" value={summary.views_today} />
            <StatCard label="Visite 7 giorni" value={summary.views_week} />
            <StatCard label="Visitatori unici" value={summary.unique_visitors} />
            <StatCard label="Unici oggi" value={summary.unique_visitors_today} />
            <StatCard label="Da registrati" value={summary.registered_views} />
            <StatCard label="Da anonimi" value={summary.anonymous_views} />
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="glass">
              <div className="glass-inner">
                <p className="eyebrow text-xs text-ink-soft">Nazioni</p>
                {summary.top_countries.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-soft">Ancora nessun dato.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {summary.top_countries.map((c) => (
                      <li key={c.country} className="flex items-center justify-between text-sm">
                        <span className="text-ink">{c.country}</span>
                        <span className="font-mono text-ink-soft">{c.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="glass">
              <div className="glass-inner">
                <p className="eyebrow text-xs text-ink-soft">Pagine più visitate</p>
                {summary.top_pages.length === 0 ? (
                  <p className="mt-2 text-sm text-ink-soft">Ancora nessun dato.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {summary.top_pages.map((p) => (
                      <li key={p.path} className="flex items-center justify-between text-sm">
                        <span className="truncate pr-3 text-ink">{p.path}</span>
                        <span className="font-mono text-ink-soft">{p.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
