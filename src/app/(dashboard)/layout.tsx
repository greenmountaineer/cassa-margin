import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get the restaurant name for the top bar
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <header
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {restaurant.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="btn-ghost">
            Settings
          </Link>
          <SignOutButton />
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 px-5 py-6 max-w-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
