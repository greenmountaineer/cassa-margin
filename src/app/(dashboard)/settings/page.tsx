"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [monthlyFixedCosts, setMonthlyFixedCosts] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("id, monthly_fixed_costs")
        .eq("user_id", user.id)
        .single();

      if (!restaurant) {
        router.push("/onboarding");
        return;
      }

      setRestaurantId(restaurant.id);
      setMonthlyFixedCosts(String(restaurant.monthly_fixed_costs ?? 0));
      setLoading(false);
    }

    load();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurantId) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ monthly_fixed_costs: Number(monthlyFixedCosts) })
      .eq("id", restaurantId);

    if (updateError) {
      setError("Could not save. Try again.");
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Fixed costs
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Rent, insurance, loan payments — the costs that don&apos;t change week
          to week. Enter what you pay in a normal month.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label
            htmlFor="monthly-fixed-costs"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Monthly fixed costs
          </label>
          <input
            id="monthly-fixed-costs"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            value={monthlyFixedCosts}
            onChange={(e) => {
              setMonthlyFixedCosts(e.target.value);
              setSaved(false);
            }}
            placeholder="0.00"
            required
            className="input"
          />
          <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
            We&apos;ll split this across the weeks so your net margin reflects
            what you actually pay, not an estimate.
          </p>
        </div>

        {error && (
          <p className="text-sm" style={{ color: "var(--status-red)" }}>
            {error}
          </p>
        )}

        {saved && !error && (
          <p className="text-sm" style={{ color: "var(--status-green)" }}>
            Saved.
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? (
            <span className="animate-pulse-soft">Saving...</span>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </div>
  );
}
