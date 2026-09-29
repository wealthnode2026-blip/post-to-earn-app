"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) throw new Error("Accesso negato");

  return { supabase, adminId: user.id };
}

export async function saveTopic(topicDate: string, title: string, description: string) {
  const { supabase, adminId } = await requireAdmin();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(topicDate)) throw new Error("Data non valida");

  const cleanTitle = title.trim();
  const cleanDescription = description.trim();

  if (!cleanTitle) throw new Error("Inserisci l'argomento");
  if (cleanTitle.length > 80) throw new Error("L'argomento può avere al massimo 80 caratteri");
  if (cleanDescription.length > 300) throw new Error("La descrizione può avere al massimo 300 caratteri");

  const { error } = await supabase.from("daily_topics").upsert({
    topic_date: topicDate,
    title: cleanTitle,
    description: cleanDescription || null,
    created_by: adminId,
  });

  if (error) throw new Error("Salvataggio non riuscito. Riprova.");

  revalidatePath("/admin/topics");
  revalidatePath("/home");
}

export async function deleteTopic(topicDate: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from("daily_topics").delete().eq("topic_date", topicDate);
  if (error) throw new Error("Eliminazione non riuscita. Riprova.");

  revalidatePath("/admin/topics");
  revalidatePath("/home");
}
