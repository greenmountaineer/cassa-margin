"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const [name, setName] = useState("");
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

    const { error: insertError } = await supabase.from("restaurants").insert({
      user_id: user.id,
      name: name.trim(),
    });

    if (insertError) {
      setError("Could not save your restaurant. Try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Let&apos;s set up your place.
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            One thing to start — what&apos;s your restaurant called?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="restaurant-name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Restaurant name
            </label>
            <input
              id="restaurant-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maria's Kitchen"
              required
              autoFocus
              className="input"
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: 'var(--status-red)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="btn-primary"
          >
            {loading ? (
              <span className="animate-pulse-soft">Setting up...</span>
            ) : (
              "Let's go"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
