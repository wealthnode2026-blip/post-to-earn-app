"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

function getClientIp(headerList: Awaited<ReturnType<typeof headers>>) {
  const forwarded = headerList.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headerList.get("x-real-ip") ?? "unknown";
}

export type AuthState = { error: string | null };

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (!email || !password || !username) {
    return { error: "Compila tutti i campi per continuare." };
  }
  if (password.length < 8) {
    return { error: "La password deve avere almeno 8 caratteri." };
  }

  const headerList = await headers();
  const registration_ip = getClientIp(headerList);

  const supabase = await createClient();

  const shouldCheckIp =
    process.env.NODE_ENV === "production" && registration_ip !== "unknown";

  if (shouldCheckIp) {
    const { data: ipAlreadyUsed, error: ipCheckError } = await supabase.rpc(
      "is_ip_registered",
      { check_ip: registration_ip }
    );

    if (ipCheckError) {
      return { error: "Errore durante la verifica, riprova." };
    }

    if (ipAlreadyUsed) {
      return {
        error: "Risulta già registrato un account da questo indirizzo IP.",
      };
    }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, registration_ip },
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/feed");
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Inserisci email e password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email o password non corretti." };
  }

  redirect("/feed");
}
