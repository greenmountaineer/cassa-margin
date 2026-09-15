-- Cassa Margin: restaurants table
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- ── Table ───────────────────────────────────────────────────────
create table if not exists restaurants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text not null,
  created_at timestamptz default now() not null
);

-- ── Row Level Security ──────────────────────────────────────────
-- A user can never read another restaurant's data.

alter table restaurants enable row level security;

-- Read your own
create policy "Users can read own restaurant"
  on restaurants for select
  using (auth.uid() = user_id);

-- Create your own
create policy "Users can insert own restaurant"
  on restaurants for insert
  with check (auth.uid() = user_id);

-- Update your own
create policy "Users can update own restaurant"
  on restaurants for update
  using (auth.uid() = user_id);

-- No delete policy — restaurants don't get deleted for now
