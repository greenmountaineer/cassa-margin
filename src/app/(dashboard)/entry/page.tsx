"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function EntryPage() {
  const [weekEnding, setWeekEnding] = useState(todayISO());
  const [netSales, setNetSales] = useState("");
  const [foodPurchases, setFoodPurchases] = useState("");
  const [bevPurchases, setBevPurchases] = useState("");
  const [totalLabor, setTotalLabor] = useState("");
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
      week_ending: weekEnding,
      net_sales: Number(netSales),
      food_purchases: Number(foodPurchases),
      bev_purchases: Number(bevPurchases),
      total_labor: Number(totalLabor),
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You've already entered numbers for that week.");
      } else {
        setError("Could not save this week's numbers. Try again.");
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          This week's numbers
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Takes about two minutes. Pull these from your POS and payroll.
        </p>
      </div>

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

        {error && (
          <p className="text-sm" style={{ color: "var(--status-red)" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="animate-pulse-soft">Saving...</span>
          ) : (
            "Save this week"
          )}
        </button>
      </form>
    </div>
  );
}
