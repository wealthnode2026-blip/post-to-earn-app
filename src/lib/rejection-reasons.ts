// Motivi di rifiuto selezionabili dall'admin. Il testo viene mostrato all'utente.
export const REJECTION_REASONS = [
  { key: "off_topic", label: "Non corrisponde all'argomento del giorno" },
  { key: "low_quality", label: "Qualità troppo bassa (sfocata, mossa o troppo buia)" },
  { key: "inappropriate", label: "Contenuto non appropriato" },
  { key: "not_original", label: "Foto non originale o non scattata da te" },
  { key: "text_or_logo", label: "Contiene testo, filigrane o loghi" },
  { key: "other", label: "Altro motivo" },
] as const;

export type RejectionReasonKey = (typeof REJECTION_REASONS)[number]["key"];

export const MAX_REJECTION_NOTE = 200;
