import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  foodCostPercent,
  laborCostPercent,
  primeCostPercent,
  getStatus,
} from "@/lib/calculations";
import { DeleteWeekButton } from "./delete-week-button";

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

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const { data: entries } = await supabase
    .from("weekly_entries")
    .select("*")
    .eq("restaurant_id", restaurant!.id)
    .order("week_ending", { ascending: false });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Past weeks
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Edit or delete a week if you entered something wrong.
        </p>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="card">
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No weeks entered yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => {
            const foodCost = foodCostPercent(
              entry.food_purchases,
              entry.bev_purchases,
              entry.net_sales
            );
            const laborCost = laborCostPercent(entry.total_labor, entry.net_sales);
            const primeCost = primeCostPercent(foodCost, laborCost);
            const status = getStatus(primeCost);

            return (
              <div key={entry.id} className="card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="status-dot" data-status={status} />
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Week ending {formatWeekEnding(entry.week_ending)}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Prime cost {formatPercent(primeCost)} · Net sales $
                      {Number(entry.net_sales).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/history/${entry.id}/edit`} className="btn-ghost">
                    Edit
                  </Link>
                  <DeleteWeekButton entryId={entry.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
