import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const VISITOR_COOKIE = "atelier_visitor_id";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
  }

  const country = request.headers.get("x-vercel-ip-country") ?? null;

  supabase
    .from("page_views")
    .insert({
      path: request.nextUrl.pathname,
      visitor_id: visitorId,
      user_id: user?.id ?? null,
      country,
    })
    .then(() => {});

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
