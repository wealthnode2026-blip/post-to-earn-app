import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const VISITOR_COOKIE = "atelier_visitor_id";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  let setVisitorCookie = false;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    setVisitorCookie = true;
  }

  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";
  const country = request.headers.get("cf-ipcountry") ?? null;

  const { error } = await supabase.from("page_views").insert({
    path,
    visitor_id: visitorId,
    user_id: user?.id ?? null,
    country,
  });

  if (error) {
    console.error("page_views insert failed:", error.message);
  }

  const response = NextResponse.json({ ok: !error });

  if (setVisitorCookie) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}
