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

function ArrowCircle() {
  return (
    <span
      className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full shrink-0"
      style={{ background: "var(--bg-primary)" }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function TalkButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/login"
      className={`inline-flex items-center rounded-full pl-5 pr-1.5 py-1.5 text-sm font-medium whitespace-nowrap ${className}`}
      style={{ background: "var(--text-primary)", color: "var(--bg-primary)" }}
    >
      Let&apos;s talk
      <ArrowCircle />
    </Link>
  );
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border-hover)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border-hover)" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--border-hover)" }} />
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="metric-card !p-4">
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Food cost</span>
        <div className="mt-2 text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>31.2%</div>
      </div>
      <div className="metric-card !p-4">
        <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Labor cost</span>
        <div className="mt-2 text-xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>28.9%</div>
      </div>
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
  );
}

function EntryMock() {
  return (
    <div className="space-y-3">
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
    <div className="space-y-3">
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>Monthly fixed costs</label>
      <div className="input !py-2 !text-sm" style={{ color: "var(--text-primary)" }}>4,200.00</div>
      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Rent, insurance, loan payments — split across the weeks.
      </p>
    </div>
  );
}

const differentiators = [
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
];

const steps = [
  { step: "STEP 01", title: "Sign in", body: "One email, one magic link. No password to forget." },
  { step: "STEP 02", title: "Enter your week", body: "Net sales, food, beverage, labor. Straight from your POS and payroll." },
  { step: "STEP 03", title: "See your four numbers", body: "Food cost, labor cost, prime cost, net margin — with a clear status." },
  { step: "STEP 04", title: "Fix what's costing you", body: "A bad number comes with a plain-English reason and what usually causes it." },
];

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
          <nav className="hidden sm:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How it works</a>
            <a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a>
          </nav>
          <TalkButton />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-5 pt-20 pb-16 text-center animate-fade-in">
        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.1]" style={{ color: "var(--text-primary)" }}>
          Cassa Margin — your definitive cost and margin tracking restaurant partner.
        </h1>
        <p className="mt-6 text-base sm:text-lg max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Enter the week&apos;s numbers and see food cost, labor cost, prime cost, and net
          margin in under five minutes. Built for owner-operators checking numbers on a
          phone between rushes.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { value: "4", label: "numbers that tell you if you're alive" },
            { value: "<5 min", label: "to check your week" },
            { value: "$49/mo", label: "for the first 50 founding members" },
            { value: "375px", label: "every screen, tested on a phone" },
          ].map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <div className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>{s.value}</div>
              <div className="mt-1 text-xs max-w-[9rem]" style={{ color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <TalkButton className="!pl-7 !pr-2 !py-2.5 text-base" />
        </div>
        <p className="mt-3 text-xs" style={{ color: "var(--text-muted)" }}>
          Free during beta. No card required.
        </p>
      </section>

      {/* Feature block */}
      <section className="border-t" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-5 py-20 grid gap-10 sm:grid-cols-2 items-center">
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
            <div className="mt-6">
              <TalkButton />
            </div>
          </div>
          <BrowserFrame>
            <DashboardMock />
          </BrowserFrame>
        </div>
      </section>

      {/* Product showcase */}
      <section className="max-w-5xl mx-auto px-5 py-20">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              What you&apos;ll actually use.
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              No dashboards to configure. No reports to build. Three screens, and you&apos;re done for the week.
            </p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <BrowserFrame><DashboardMock /></BrowserFrame>
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>The dashboard</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Four numbers, one glance, a color you can&apos;t miss.</p>
          </div>
          <div>
            <BrowserFrame><EntryMock /></BrowserFrame>
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>Weekly entry</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Two minutes, pulled straight from your POS and payroll.</p>
          </div>
          <div>
            <BrowserFrame><SettingsMock /></BrowserFrame>
            <p className="mt-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>Fixed costs</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Set once. Net margin uses the real number every week after.</p>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-t" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
        <div className="max-w-5xl mx-auto px-5 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
            Built for the numbers, not the software.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((f) => (
              <div key={f.title} className="card">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
                <p className="mt-2 text-xs" style={{ color: "var(--text-secondary)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-5 py-20">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
          Five minutes, once a week.
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
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
        <div className="max-w-2xl mx-auto px-5 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Five minutes a week. That&apos;s it.
          </h2>
          <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            Free during beta. $99/month after — and the first 50 founding members
            lock in $49/month for life.
          </p>
          <div className="mt-8 flex justify-center">
            <TalkButton className="!pl-7 !pr-2 !py-2.5 text-base" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                <Mark size={14} />
              </div>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Cassa Margin</span>
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--text-secondary)" }}>
              Know if you made money this week.
            </p>
            <div className="mt-5">
              <TalkButton />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>PRODUCT</p>
            <ul className="mt-3 space-y-2">
              <li><a href="#how-it-works" className="text-sm" style={{ color: "var(--text-secondary)" }}>How it works</a></li>
              <li><a href="#pricing" className="text-sm" style={{ color: "var(--text-secondary)" }}>Pricing</a></li>
              <li><Link href="/login" className="text-sm" style={{ color: "var(--text-secondary)" }}>Sign in</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>THE MATH</p>
            <ul className="mt-3 space-y-2">
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>Food cost %</span></li>
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>Labor cost %</span></li>
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>Prime cost %</span></li>
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>Net margin</span></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium tracking-wide" style={{ color: "var(--text-muted)" }}>COMPANY</p>
            <ul className="mt-3 space-y-2">
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>Independent restaurants</span></li>
              <li><span className="text-sm" style={{ color: "var(--text-secondary)" }}>$500K–$2M a year</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 pb-8 text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 Cassa Margin. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
