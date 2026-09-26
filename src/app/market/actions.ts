"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function buyFilmRoll() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase.rpc("purchase_film_roll");
  if (error) throw new Error(error.message);

  revalidatePath("/market");
  revalidatePath("/home");
}

export async function buyCamera(cameraType: "pro" | "master") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autenticato");

  const { error } = await supabase.rpc("purchase_camera", {
    p_camera_type: cameraType,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/market");
}
