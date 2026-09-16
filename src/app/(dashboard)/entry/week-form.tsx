"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type WeekFormProps = {
  mode: "create" | "edit";
  entryId?: string;
  initial?: {
    week_ending: string;
    net_sales: number;
    food_purchases: number;
    bev_purchases: number;
    total_labor: number;
    other_costs: number;
  };
};

export function WeekForm({ mode, entryId, initial }: WeekFormProps) {
  const [weekEnding, setWeekEnding] = useState(initial?.week_ending ?? todayISO());
  const [netSales, setNetSales] = useState(initial ? String(initial.net_sales) : "");
  const [foodPurchases, setFoodPurchases] = useState(
    initial ? String(initial.food_purchases) : ""
  );
  const [bevPurchases, setBevPurchases] = useState(
    initial ? String(initial.bev_purchases) : ""
  );
  const [totalLabor, setTotalLabor] = useState(initial ? String(initial.total_labor) : "");
  const [otherCosts, setOtherCosts] = useState(
    initial && initial.other_costs ? String(initial.other_costs) : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be signed in. Check your email for the link.");
      setLoading(false);
      return;
    }

    const values = {
      week_ending: weekEnding,
      net_sales: Number(netSales),
      food_purchases: Number(foodPurchases),
      bev_purchases: Number(bevPurchases),
      total_labor: Number(totalLabor),
      other_costs: Number(otherCosts || 0),
    };

    if (mode === "edit" && entryId) {
      const { error: updateError } = await supabase
        .from("weekly_entries")
        .update(values)
        .eq("id", entryId);

      if (updateError) {
        setError(
          updateError.code === "23505"
            ? "You've already entered numbers for that week."
            : "Could not save changes. Try again."
        );
        setLoading(false);
        return;
      }

      router.push("/history");
      router.refresh();
      return;
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!restaurant) {
      setError("Set up your restaurant first.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("weekly_entries").insert({
      restaurant_id: restaurant.id,
      ...values,
    });

    if (insertError) {
      setError(
        insertError.code === "23505"
          ? "You've already entered numbers for that week."
          : "Could not save this week's numbers. Try again."
      );
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div>
        <label
          htmlFor="week-ending"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Week ending
        </label>
        <input
          id="week-ending"
          type="date"
          value={weekEnding}
          onChange={(e) => setWeekEnding(e.target.value)}
          required
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="net-sales"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Net sales
        </label>
        <input
          id="net-sales"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={netSales}
          onChange={(e) => setNetSales(e.target.value)}
          placeholder="0.00"
          required
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="food-purchases"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Food purchases
        </label>
        <input
          id="food-purchases"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={foodPurchases}
          onChange={(e) => setFoodPurchases(e.target.value)}
          placeholder="0.00"
          required
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="bev-purchases"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Beverage purchases
        </label>
        <input
          id="bev-purchases"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={bevPurchases}
          onChange={(e) => setBevPurchases(e.target.value)}
          placeholder="0.00"
          required
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="total-labor"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Total labor cost
        </label>
        <input
          id="total-labor"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={totalLabor}
          onChange={(e) => setTotalLabor(e.target.value)}
          placeholder="0.00"
          required
          className="input"
        />
      </div>

      <div>
        <label
          htmlFor="other-costs"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Other costs <span style={{ color: "var(--text-muted)" }}>(optional)</span>
        </label>
        <input
          id="other-costs"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={otherCosts}
          onChange={(e) => setOtherCosts(e.target.value)}
          placeholder="0.00"
          className="input"
        />
        <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
          Repairs, small equipment, anything one-off for this week that isn&apos;t
          food, beverage, or labor.
        </p>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--status-red)" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (
          <span className="animate-pulse-soft">Saving...</span>
        ) : mode === "edit" ? (
          "Save changes"
        ) : (
          "Save this week"
        )}
      </button>
    </form>
  );
}
