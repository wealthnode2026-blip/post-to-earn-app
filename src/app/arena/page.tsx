import { UserNav } from "../components/user-nav";

// Nota interna: Arena disattivata finche' la community non e' abbastanza numerosa
// da rendere il voto interessante. Il codice precedente (matchmaking a coppie, voto
// cieco, banner countdown) resta in repo, solo scollegato dal routing pubblico.
export default function ArenaPage() {
  return (
    <>
      <UserNav active="arena" />
      <div className="mx-auto w-full max-w-sm px-6 py-16">
        <h1 className="font-display text-2xl italic text-ink">Arena dei Duelli</h1>
        <p className="mt-2 text-sm font-medium text-accent-ink">Arriva presto</p>

        <div className="mt-8 rounded-lg border border-line bg-surface p-5">
          <p className="text-sm text-ink">Come funzionerà</p>
          <ul className="mt-3 space-y-3 text-sm text-ink-soft">
            <li>
              Ogni <span className="text-ink">sabato</span> tutte le foto approvate della
              settimana entrano in gara nell&apos;Arena.
            </li>
            <li>
              Tutti gli utenti con un <span className="text-ink">rullino attivo</span> possono
              votare la foto che preferiscono tra tutte quelle in gara.
            </li>
            <li>
              Le votazioni chiudono la <span className="text-ink">domenica sera</span>. La foto
              più votata entra nella <span className="text-ink">Hall of Fame</span> per sempre, e
              chi l&apos;ha scattata riceve anche un premio in{" "}
              <span className="text-ink">USDT</span>.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
