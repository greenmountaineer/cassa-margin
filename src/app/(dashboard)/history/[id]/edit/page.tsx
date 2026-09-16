import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WeekForm } from "../../../entry/week-form";

export default async function EditWeekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry } = await supabase
    .from("weekly_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (!entry) {
    notFound();
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Edit week ending {entry.week_ending}
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Fix what you entered. This recalculates everything on the dashboard.
        </p>
      </div>

      <WeekForm mode="edit" entryId={entry.id} initial={entry} />
    </div>
  );
}
