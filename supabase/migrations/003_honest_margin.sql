-- Cassa Margin: Honest margin
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor → New Query)

-- ── Fixed costs live on the restaurant profile ─────────────────
-- Rent, insurance, loan payments — the costs that don't move week to week.
-- Entered monthly (that's how owners actually get billed), converted to a
-- weekly figure in the calculation module.
alter table restaurants
  add column if not exists monthly_fixed_costs numeric not null default 0;

-- ── Other costs live on the weekly entry ───────────────────────
-- One-off or variable costs for that specific week — repairs, small
-- equipment, anything that isn't food, beverage, labor, or a fixed cost.
alter table weekly_entries
  add column if not exists other_costs numeric not null default 0;

-- ── Edit and delete past weeks ──────────────────────────────────
-- A user can only ever touch weekly entries for a restaurant they own.

create policy "Users can update own weekly entries"
  on weekly_entries for update
  using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );

create policy "Users can delete own weekly entries"
  on weekly_entries for delete
  using (
    restaurant_id in (select id from restaurants where user_id = auth.uid())
  );
