import Link from "next/link";

function Mark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17L12 22L22 17" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12L12 17L22 12" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardMock() {
  const rows = [
    { label: "Food cost", value: "31.2%" },
    { label: "Labor cost", value: "28.9%" },
  ];
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {rows.map((r) => (
          <div key={r.label} className="metric-card !p-4">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{r.label}</span>
            <div className="mt-2 text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{r.value}</div>
          </div>
        ))}
        <div className="metric-card !p-4 col-span-2" data-status="amber">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Prime cost</span>
            <span className="flex items-center gap-1.5">
              <span className="status-dot" data-status="amber" />
              <span className="text-xs font-medium" style={{ color: "var(--status-amber)" }}>Watch this</span>
            </span>
          </div>
          <div className="text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>60.1%</div>
        </div>
      </div>
    </div>
  );
}

function EntryMock() {
  return (
    <div className="card !p-4 space-y-3">
      {["Net sales", "Food purchases", "Total labor cost"].map((label) => (
        <div key={label}>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>{label}</label>
          <div className="input !py-2 !text-sm" style={{ color: "var(--text-muted)" }}>0.00</div>
        </div>
      ))}
    </div>
  );
}

function SettingsMock() {
  return (
    <div className="card !p-4 space-y-3">
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Monthly fixed costs</label>
      <div className="input !py-2 !text-sm" style={{ color: "var(--text-primary)" }}>4,200.00</div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Rent, insurance, loan payments — split across the weeks.
      </p>
    </div>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-full">
      {/* Nav */}
      <header className="sticky top-0 z-10 backdrop-blur" style={{ background: "rgba(10,10,10,0.8)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <Mark size={14} />
            </div>
            <span className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>Cassa Margin</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How it works</a>
            <a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a>
          </nav>
          <Link href="/login" className="btn-ghost whitespace-nowrap">Sign in</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 pt-16 pb-12 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight" style={{ color: "var(--text-primary)" }}>
          Know if your restaurant made money this week.
        </h1>
        <p className="mt-5 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Enter the week&apos;s numbers and see food cost, labor cost, prime cost, and net
          margin in under five minutes. Built for owner-operators checking numbers on a
          phone between rushes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {[
            { value: "4", label: "numbers that tell you if you're alive" },
            { value: "<5 min", label: "to check your week" },
            { value: "$49/mo", label: "for the first 50 founding members" },
          ].map((s) => (
            <div key={s.label} className="text-left">
              <div className="text-2xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="text-xs max-w-[10rem]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/login" className="btn-primary !w-auto px-8">
            Get started free
          </Link>
        </div>
        <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Free during beta. No card required.
        </p>
      </section>

      {/* Feature block */}
      <section className="border-t" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-5 py-16 grid gap-10 sm:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              One number tells you if you&apos;re in trouble.
            </h2>
            <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              Prime cost — food and labor combined — is the number that makes or breaks
              a restaurant. Under 60% is healthy. 60 to 65 is worth watching. Above 65
              and something&apos;s wrong. Cassa Margin runs it through one tested
              calculation module every time, so the number on your screen is always
              right — never a different formula hiding in a different screen.
            </p>
          </div>
          <DashboardMock />
        </div>
      </section>

      {/* Product showcase */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            What you&apos;ll actually use.
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            No dashboards to configure. No reports to build. Three screens, and you&apos;re done for the week.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <DashboardMock />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>The dashboard</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Four numbers, one glance, a color you can&apos;t miss.</p>
          </div>
          <div>
            <EntryMock />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>Weekly entry</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Two minutes, pulled straight from your POS and payroll.</p>
          </div>
          <div>
            <SettingsMock />
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>Fixed costs</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Set once. Net margin uses the real number every week after.</p>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-t" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
            Built for the numbers, not the software.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "One tested calculation module",
                body: "Every percentage comes from the same math. No two screens can ever disagree.",
              },
              {
                title: "Your data is yours alone",
                body: "Row-level security on every table. No one else can ever read your numbers.",
              },
              {
                title: "Works between rushes",
                body: "Every screen works on a phone at 375 pixels wide. No pinching, no tiny buttons.",
              },
              {
                title: "Plain English, always",
                body: "“Net sales” is fine. “Fetch failed” is not. If a number's bad, we say why.",
              },
            ].map((f) => (
              <div key={f.title} className="card">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-5 py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
          Five minutes, once a week.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: "STEP 01", title: "Sign in", body: "One email, one magic link. No password to forget." },
            { step: "STEP 02", title: "Enter your week", body: "Net sales, food, beverage, labor. Straight from your POS and payroll." },
            { step: "STEP 03", title: "See your four numbers", body: "Food cost, labor cost, prime cost, net margin — with a clear status." },
            { step: "STEP 04", title: "Fix what's costing you", body: "A bad number comes with a plain-English reason and what usually causes it." },
          ].map((s) => (
            <div key={s.step} className="card">
              <span className="text-xs font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>{s.step}</span>
              <h3 className="mt-2 text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.title}</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / final CTA */}
      <section id="pricing" className="border-t" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="max-w-2xl mx-auto px-5 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Five minutes a week. That&apos;s it.
          </h2>
          <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Free during beta. $99/month after — and the first 50 founding members
            lock in $49/month for life.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/login" className="btn-primary !w-auto px-8">
              Get started free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-5xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <Mark size={14} />
            </div>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Cassa Margin — © 2026
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How it works</a>
            <a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a>
            <Link href="/login" className="text-sm" style={{ color: "var(--text-secondary)" }}>Sign in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
