-- Cassa Margin: weekly_entries table
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- ── Table ───────────────────────────────────────────────────────
create table if not exists weekly_entries (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  week_ending date not null,
  net_sales numeric not null,
  food_purchases numeric not null,
  bev_purchases numeric not null,
  total_labor numeric not null,
  created_at timestamptz default now() not null,
  unique (restaurant_id, week_ending)
);

-- ── Row Level Security ──────────────────────────────────────────
-- A user can only ever touch weekly entries for a restaurant they own.

alter table weekly_entries enable row level security;

create policy "Users can read own weekly entries"
  on weekly_entries for select
  using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can insert own weekly entries"
  on weekly_entries for insert
  with check (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

-- No update or delete policy yet — editing and deleting past weeks
-- comes with the "Honest margin" slice, with clean recalculation.
