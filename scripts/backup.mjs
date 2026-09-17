// Manual data backup — dumps every row from every table to a timestamped
// JSON file. Run this periodically until real backup infrastructure
// (Supabase Pro, or an automated job on real hosting) is in place.
//
// Usage:
//   npm run backup
//
// Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from
// .env.local (both already there — never prefix the service key with
// NEXT_PUBLIC_, it bypasses row-level security).

import { createClient } from "@supabase/supabase-js";
import { mkdirSync, writeFileSync } from "fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set SUPABASE_SERVICE_ROLE_KEY in .env.local (never commit it) or pass it inline."
  );
  process.exit(1);
}

const TABLES = ["restaurants", "weekly_entries"];

async function main() {
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = new URL(`../backups/${stamp}/`, import.meta.url);
  mkdirSync(outDir, { recursive: true });

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    if (error) {
      console.error(`Failed to export ${table}:`, error.message);
      process.exit(1);
    }
    writeFileSync(new URL(`${table}.json`, outDir), JSON.stringify(data, null, 2));
    console.log(`Exported ${data.length} row(s) from ${table}`);
  }

  console.log(`Backup written to backups/${stamp}/`);
}

main();
