# Known issues

## Weekly digest cron fails on Vercel (unresolved)

`/api/cron/weekly-digest` works correctly in local dev but returns
`500 TypeError: fetch failed` when deployed on Vercel. The underlying
error is `getaddrinfo ENOTFOUND <project-ref>.supabase.co` — Vercel's
Node.js serverless runtime cannot resolve the Supabase project hostname,
even though:

- The exact same hostname resolves fine from a regular machine and from
  Vercel's **Edge** runtime (the app's own middleware uses it successfully
  for every page load).
- A plain `fetch("https://example.com")` from the same serverless function
  succeeds — general outbound DNS/network is not broken.
- A raw `fetch()` straight to the Supabase URL (bypassing the Supabase SDK
  entirely) fails the same way — this isn't a Supabase client bug.
- The environment variable holding the URL was verified byte-for-byte
  correct via a diagnostic log.

**Ruled out:**
- Copy-paste corruption in environment variables (reset all six vars
  cleanly via the Vercel CLI — no change).
- `NODE_OPTIONS=--dns-result-order=ipv4first` as a Vercel env var — Vercel
  strips `NODE_OPTIONS` on its Node runtime, so this has no effect.
- `dns.setDefaultResultOrder("ipv4first")` called in code — still fails.
  Left in `route.ts` anyway since it's harmless and this is a documented
  fix for a related class of issue; it just didn't fix this specific case.
- Switching the route to Edge runtime — resolves the DNS problem (as
  expected, since Edge works) but then crashes with an opaque
  `Error: internal error` from inside the Edge function, likely because
  something in the Supabase admin SDK or Resend's SDK isn't fully
  Edge-compatible. Reverted back to Node runtime since an opaque crash
  isn't better than a diagnosable one.

**Likely cause:** a known class of flaky DNS resolution specific to AWS
Lambda's internal resolver (which underlies Vercel's Node functions) for
certain custom subdomains. Not something fixable from application code.

**Next things to try:**
- Open a Vercel support ticket with this exact writeup — they can see
  which resolver/region the function actually hit.
- Try a different Vercel function region (Project Settings → Functions →
  Region) in case it's specific to the current one (`iad1`).
- Try Supabase's pooler/alternate connection hostname if one exists,
  instead of the project's direct REST URL.
- Revisit whether Edge runtime is viable by finding and fixing whatever
  specifically crashes there (would need its own diagnostic pass).

**Impact:** the Monday digest and missing-week reminder emails do not
currently send automatically in production. Nothing else is affected —
auth, the dashboard, weekly entry, and all RLS-protected data access work
normally, since those use Supabase's anon key via Edge middleware, not
this code path.
