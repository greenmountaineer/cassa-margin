import { setDefaultResultOrder } from "node:dns";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, EMAIL_FROM } from "@/lib/resend";
import { buildDigestEmail, buildReminderEmail } from "@/lib/email/digest";

// Attempted fix for a known class of Vercel Node-runtime DNS issue
// (ENOTFOUND on custom subdomains like Supabase's project URL). Left in
// because it's harmless even though it didn't resolve the actual bug —
// see KNOWN_ISSUES.md.
setDefaultResultOrder("ipv4first");

export const dynamic = "force-dynamic";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const resend = getResendClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, user_id, name");

  if (error) {
    return NextResponse.json(
      { error: error.message, details: error.details, hint: error.hint, code: error.code },
      { status: 500 }
    );
  }

  const results: { restaurant: string; sent: "digest" | "reminder" | "skipped"; reason?: string }[] = [];

  for (const restaurant of restaurants ?? []) {
    const { data: entries } = await supabase
      .from("weekly_entries")
      .select("week_ending, net_sales, food_purchases, bev_purchases, total_labor")
      .eq("restaurant_id", restaurant.id)
      .order("week_ending", { ascending: false })
      .limit(2);

    const { data: userData } = await supabase.auth.admin.getUserById(restaurant.user_id);
    const email = userData?.user?.email;

    if (!email) {
      results.push({ restaurant: restaurant.name, sent: "skipped", reason: "no email on file" });
      continue;
    }

    const latest = entries?.[0];
    const isCurrent =
      latest != null && Date.now() - new Date(`${latest.week_ending}T00:00:00Z`).getTime() <= WEEK_MS;

    try {
      const kind = isCurrent && latest ? "digest" : "reminder";
      const { subject, html, text } =
        kind === "digest" && latest
          ? buildDigestEmail({
              restaurantName: restaurant.name,
              weekEnding: latest.week_ending,
              current: latest,
              previous: entries?.[1] ?? null,
              appUrl,
            })
          : buildReminderEmail({ restaurantName: restaurant.name, appUrl });

      const { error: sendError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject,
        html,
        text,
      });

      if (sendError) {
        results.push({ restaurant: restaurant.name, sent: "skipped", reason: sendError.message });
      } else {
        results.push({ restaurant: restaurant.name, sent: kind });
      }
    } catch (err) {
      results.push({
        restaurant: restaurant.name,
        sent: "skipped",
        reason: err instanceof Error ? err.message : "send failed",
      });
    }
  }

  return NextResponse.json({ ok: true, results });
}
