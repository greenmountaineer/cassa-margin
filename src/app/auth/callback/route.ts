import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if user has a restaurant — if not, send to onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: restaurant } = await supabase
          .from("restaurants")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!restaurant) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange fails, send to login with no error message —
  // the link may have expired, they can request a new one
  return NextResponse.redirect(`${origin}/login`);
}
