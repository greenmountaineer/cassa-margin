import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  foodCostPercent,
  laborCostPercent,
  primeCostPercent,
  netMarginPercent,
  getStatus,
  getStatusLabel,
} from "@/lib/calculations";

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function formatWeekEnding(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const { data: entry } = await supabase
    .from("weekly_entries")
    .select("*")
    .eq("restaurant_id", restaurant!.id)
    .order("week_ending", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!entry) {
    return (
      <div>
        <div className="mb-6">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            This week
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Enter your first week&apos;s numbers to see how you&apos;re doing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {["Food cost", "Labor cost", "Prime cost", "Net margin"].map((label) => (
            <div key={label} className="metric-card">
              <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                {label}
              </span>
              <div className="mt-3 mb-2">
                <span
                  className="text-3xl font-semibold tracking-tight"
                  style={{ color: "var(--text-muted)" }}
                >
                  —
                </span>
              </div>
            </div>
          ))}
        </div>

        <Link href="/entry" className="btn-primary mt-8 inline-flex">
          Enter this week&apos;s numbers
        </Link>
      </div>
    );
  }

  const foodCost = foodCostPercent(entry.food_purchases, entry.bev_purchases, entry.net_sales);
  const laborCost = laborCostPercent(entry.total_labor, entry.net_sales);
  const primeCost = primeCostPercent(foodCost, laborCost);
  const netMargin = netMarginPercent(
    entry.net_sales,
    entry.food_purchases,
    entry.bev_purchases,
    entry.total_labor
  );
  const status = getStatus(primeCost);
  const statusLabel = getStatusLabel(status);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Week ending {formatWeekEnding(entry.week_ending)}
          </h2>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Here&apos;s how the week went.
          </p>
        </div>
        <Link href="/entry" className="btn-ghost whitespace-nowrap">
          New week
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="metric-card animate-fade-in">
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Food cost
          </span>
          <div className="mt-3 mb-2">
            <span
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {formatPercent(foodCost)}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Food and beverage purchases as a share of sales
          </p>
        </div>

        <div className="metric-card animate-fade-in-delay-1">
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Labor cost
          </span>
          <div className="mt-3 mb-2">
            <span
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {formatPercent(laborCost)}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            What you paid your team as a share of sales
          </p>
        </div>

        <div className="metric-card animate-fade-in-delay-2" data-status={status}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Prime cost
            </span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot" data-status={status} />
              <span className="text-xs font-medium" style={{ color: `var(--status-${status})` }}>
                {statusLabel}
              </span>
            </span>
          </div>
          <div className="mb-2">
            <span
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {formatPercent(primeCost)}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Food plus labor — the number that makes or breaks you
          </p>
        </div>

        <div className="metric-card animate-fade-in-delay-3">
          <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Net margin
          </span>
          <div className="mt-3 mb-2">
            <span
              className="text-3xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {formatPercent(netMargin)}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            What you actually kept after everything — fixed costs not counted yet
          </p>
        </div>
      </div>
    </div>
  );
}
