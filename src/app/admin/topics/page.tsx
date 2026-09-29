import { createClient } from "@/utils/supabase/server";
import { todayRomeISO } from "@/utils/date";
import { TopicForm } from "./topic-form";
import { DeleteTopicButton } from "./delete-topic-button";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("it-IT", {
    weekday: "short",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export default async function AdminTopicsPage() {
  const supabase = await createClient();
  const today = todayRomeISO();

  const { data: topics } = await supabase
    .from("daily_topics")
    .select("topic_date, title, description")
    .order("topic_date", { ascending: false })
    .limit(30);

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl italic text-ink">Argomento del giorno</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Gli utenti vedono l&apos;argomento nella Home e caricano la foto su quel tema. Puoi
        programmare i giorni successivi in anticipo.
      </p>

      <TopicForm defaultDate={today} />

      <h2 className="mb-3 font-display text-lg italic text-ink">Argomenti inseriti</h2>
      {!topics || topics.length === 0 ? (
        <p className="text-sm text-ink-soft">Nessun argomento inserito ancora.</p>
      ) : (
        <ul className="space-y-3">
          {topics.map((t) => (
            <li
              key={t.topic_date}
              className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4"
            >
              <div className="min-w-0">
                <p className="text-xs capitalize text-ink-soft">
                  {formatDate(t.topic_date)}
                  {t.topic_date === today && (
                    <span className="ml-2 rounded-full border border-neon/20 bg-neon-soft px-2 py-0.5 text-[10px] font-medium text-neon-ink">
                      Oggi
                    </span>
                  )}
                </p>
                <p className="mt-1 font-medium text-ink">{t.title}</p>
                {t.description && <p className="mt-1 text-sm text-ink-soft">{t.description}</p>}
              </div>
              <DeleteTopicButton topicDate={t.topic_date} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
