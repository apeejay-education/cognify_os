import { useState } from "react";
import type { AuthUser } from "../App";

interface Props {
  onLogin: (user: AuthUser, token: string) => void;
}

const ICONS = ["school", "analytics", "people", "payments", "auto_awesome", "trending_up", "notifications", "assignment", "star"];

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-stack-lg py-stack-md bg-transparent">
        <div className="flex items-center gap-unit">
          <span className="material-symbols-outlined text-primary text-2xl">bubble_chart</span>
          <span className="text-2xl font-semibold text-on-background">Cognify</span>
        </div>
      </header>

      {/* Left: Login form */}
      <section className="w-full md:w-1/2 flex items-center justify-center p-stack-lg bg-primary-container relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary-fixed opacity-20 blur-[100px]" />
        <div className="glass-panel p-stack-lg rounded-3xl w-full max-w-md relative z-10">
          <div className="mb-stack-lg">
            <h1 className="text-h2 font-semibold text-on-background mb-unit" style={{ letterSpacing: "-0.01em" }}>
              Welcome back
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Access your education business dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-stack-md">
            {error && (
              <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="space-y-unit">
              <label className="text-label-caps font-bold tracking-widest text-on-tertiary-container block px-unit uppercase">
                Email Address
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="owner@cognify.app"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-unit">
              <label className="text-label-caps font-bold tracking-widest text-on-tertiary-container block px-unit uppercase">
                Password
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-3 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input className="rounded-sm border-outline-variant text-primary" type="checkbox" />
                <span className="text-body-md text-on-surface-variant">Remember me</span>
              </label>
              <a className="text-body-md text-primary font-medium hover:underline cursor-pointer">
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full mesh-gradient-primary text-on-primary font-semibold py-4 rounded-xl shadow-lg hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 text-lg"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
            </button>
          </form>

          <div className="mt-stack-lg pt-stack-md border-t border-surface-container-highest flex flex-col items-center gap-stack-sm">
            <p className="text-body-md text-on-surface-variant">New to Cognify?</p>
            <a className="text-h3 text-primary font-semibold hover:underline cursor-pointer">
              Create an account
            </a>
          </div>
        </div>
      </section>

      {/* Right: Visual */}
      <section className="hidden md:flex w-1/2 relative bg-mesh-canvas items-center justify-center overflow-hidden">
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-tertiary-fixed/30 to-secondary-fixed/30 rounded-full blur-[120px] animate-pulse" />
          <div className="relative z-10 grid grid-cols-3 gap-4">
            {ICONS.map((icon, i) => (
              <div key={i} className="w-20 h-20 rounded-2xl glass-panel flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-20 left-20 glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 z-20">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-secondary-container">auto_awesome</span>
          </div>
          <div>
            <span className="text-label-caps font-bold tracking-widest text-on-tertiary-container block mb-1 uppercase">
              CURRENT STATUS
            </span>
            <span className="text-body-md text-on-surface font-semibold">AI-Powered Education OS</span>
          </div>
        </div>

        <div className="absolute top-40 right-20 glass-panel px-4 py-2 rounded-full z-20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
          <span className="text-label-caps font-bold tracking-widest text-on-surface uppercase">LIVE PLATFORM</span>
        </div>

        <div className="absolute bottom-6 right-6 text-xs text-on-surface-variant/50 text-right leading-relaxed">
          Demo: owner@cognify.app<br />Password: cognify2024
        </div>
      </section>

      <footer className="fixed bottom-0 left-0 w-full z-50 flex flex-col md:flex-row justify-between items-center px-stack-lg py-stack-sm bg-transparent">
        <span className="text-label-caps text-on-tertiary-container opacity-70">
          © 2026 Cognify. Run your education business.
        </span>
        <div className="flex gap-stack-md">
          {["Privacy", "Terms", "Support"].map((link) => (
            <a key={link} className="text-label-caps text-on-tertiary-container opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
