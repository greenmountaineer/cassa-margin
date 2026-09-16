import { WeekForm } from "./week-form";

export default function EntryPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          This week&apos;s numbers
        </h2>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Takes about two minutes. Pull these from your POS and payroll.
        </p>
      </div>

      <WeekForm mode="create" />
    </div>
  );
}
