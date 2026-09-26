"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { startOfTodayUTC, mondayOfWeekUTC } from "@/utils/date";

export type UploadState = { error: string | null };

const MAX_SIZE = 10 * 1024 * 1024; // 10MB, coerente col limite del bucket
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadDailyPhoto(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_banned")
    .eq("id", user.id)
    .single();

  if (profile?.is_banned) {
    return { error: "Il tuo account è sospeso. Contatta il supporto." };
  }

  // Un solo post al giorno
  const { count } = await supabase
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", startOfTodayUTC().toISOString());

  if (count && count > 0) {
    return { error: "Hai già pubblicato la tua foto di oggi. Torna domani." };
  }

  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Seleziona una foto da caricare." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { error: "Formato non supportato. Usa JPEG, PNG o WebP." };
  }
  if (file.size > MAX_SIZE) {
    return { error: "Il file supera i 10MB consentiti." };
  }

  // Consuma il tentativo di upload (trial o rullino) solo dopo aver validato il file,
  // cosi' un file scartato per formato/dimensione non brucia uno scatto.
  const { data: attemptResult, error: attemptError } = await supabase.rpc(
    "consume_upload_attempt"
  );

  if (attemptError) {
    if (attemptError.message.includes("no_active_roll")) {
      return {
        error: "Nessun rullino attivo. Vai su Market per acquistarne uno e riprendere a caricare.",
      };
    }
    return { error: "Non è stato possibile verificare il tuo rullino. Riprova." };
  }

  const isTrial = attemptResult === "trial";

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("daily-photos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return { error: "Caricamento non riuscito. Riprova." };
  }

  const { error: insertError } = await supabase.from("posts").insert({
    user_id: user.id,
    image_path: path,
    week_start: mondayOfWeekUTC(),
    status: "pending",
    is_trial: isTrial,
  });

  if (insertError) {
    // Evita foto orfane nello storage se l'insert fallisce
    await supabase.storage.from("daily-photos").remove([path]);
    return { error: "Non è stato possibile registrare il post. Riprova." };
  }

  revalidatePath("/home");
  return { error: null };
}
