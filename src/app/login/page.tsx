"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError("Something went wrong sending your link. Try again.");
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Cassa Margin
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Know if your restaurant made money this week.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourrestaurant.com"
                required
                autoFocus
                className="input"
                autoComplete="email"
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: 'var(--status-red)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="btn-primary"
            >
              {loading ? (
                <span className="animate-pulse-soft">Sending...</span>
              ) : (
                "Send me a sign-in link"
              )}
            </button>
          </form>
        ) : (
          <div className="card text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full"
                 style={{ background: 'var(--status-green-bg)', border: '1px solid var(--status-green-border)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="var(--status-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Check your email
            </p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              We sent a sign-in link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
