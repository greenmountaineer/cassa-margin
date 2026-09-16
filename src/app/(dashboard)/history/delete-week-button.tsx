"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function DeleteWeekButton({ entryId }: { entryId: string }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Delete this week's numbers? This can't be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();
    await supabase.from("weekly_entries").delete().eq("id", entryId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="btn-ghost"
      style={{ color: "var(--status-red)" }}
    >
      {deleting ? "..." : "Delete"}
    </button>
  );
}
