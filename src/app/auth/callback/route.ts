import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next");
  const safeNext = nextParam && nextParam.startsWith("/") ? nextParam : null;
  const next = safeNext ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const loginUrl = new URL(`${origin}/login`);
  loginUrl.searchParams.set("error", "auth_failed");
  if (safeNext) {
    loginUrl.searchParams.set("next", safeNext);
  }
  return NextResponse.redirect(loginUrl.toString());
}
