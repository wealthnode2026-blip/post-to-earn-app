import { UserNav } from "../components/user-nav";

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
              Ogni <span className="text-ink">sabato</span> le foto approvate della settimana
              vengono accoppiate in duelli a coppie.
            </li>
            <li>
              Gli utenti <span className="text-ink">Pro e Master</span> votano la foto che
              preferiscono tra le due.
            </li>
            <li>
              Le votazioni chiudono la <span className="text-ink">domenica sera</span>: la foto
              più votata vince ed entra nella Hall of Fame per sempre.
            </li>
          </ul>
        </div>

        <p className="mt-6 text-xs text-ink-soft">
          Attiveremo l&apos;Arena appena la community sarà abbastanza numerosa da rendere i
          duelli interessanti. Continua a caricare le tue foto: ogni scatto approvato conta comunque
          per i tuoi crediti.
        </p>
      </div>
    </>
  );
}
