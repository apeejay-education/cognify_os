import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../App";

interface DashboardData {
  stats: {
    totalLeads: number;
    demosToday: number;
    admissions: number;
    contacted: number;
    newLeads: number;
  };
  branches: Array<{
    name: string;
    subtitle: string;
    score: number;
    status: "excellent" | "stable" | "attention";
  }>;
  insights: Array<{
    type: "insight" | "alert" | "action";
    time: string;
    text: string;
  }>;
  user: { name: string; email: string };
}

const BRANCH_ICONS = ["location_on", "apartment", "school"];

const STATUS_CONFIG = {
  excellent: { bg: "bg-green-50", text: "text-green-700", border: "border-green-100", dot: "bg-green-600 animate-pulse", label: "EXCELLENT" },
  stable: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100", dot: "bg-amber-600", label: "STABLE" },
  attention: { bg: "bg-red-50", text: "text-red-700", border: "border-red-100", dot: "bg-red-600", label: "REQUIRES ATTENTION" },
};

const INSIGHT_TYPE_CONFIG = {
  insight: { bg: "bg-primary-container", text: "text-primary", label: "INSIGHT" },
  alert: { bg: "bg-tertiary-container", text: "text-tertiary", label: "ALERT" },
  action: { bg: "bg-secondary-container", text: "text-secondary", label: "QUICK ACTION" },
};

export default function DashboardPage() {
  const { user, token, navigate } = useApp();
  const [data, setData] = useState<DashboardData | null>(null);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    fetch("/api/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name.split(" ")[0] ?? "Owner";

  return (
    <div className="min-h-screen bg-background mesh-bg text-on-surface">
      <Navbar />

      <main className="pt-32 pb-stack-lg max-w-container-max mx-auto px-margin-page grid grid-cols-12 gap-gutter">
        {/* Main content (9 cols) */}
        <div className="col-span-12 lg:col-span-9 space-y-stack-lg">
          {/* Header */}
          <section>
            <h1 className="text-h1 font-semibold text-on-surface mb-2" style={{ letterSpacing: "-0.02em" }}>
              {greeting}, {firstName}
            </h1>
            <p className="text-body-lg text-on-surface-variant">
              Here is a snapshot of your education business today.
            </p>
          </section>

          {/* Stats cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Total Leads */}
            <div className="glass-panel p-stack-md rounded-3xl ambient-shadow group hover:scale-[1.01] transition-transform duration-300">
              <span className="text-label-caps font-bold tracking-widest text-on-secondary-fixed-variant mb-4 block uppercase">
                Total Leads
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[40px] font-semibold text-primary">
                  {data ? data.stats.totalLeads.toLocaleString() : "—"}
                </span>
                <div className="flex items-center gap-1 text-green-600 text-label-caps font-bold bg-green-50 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  <span>12%</span>
                </div>
              </div>
              <div className="mt-4 h-12 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {[40, 60, 35, 75, 90].map((h, i) => (
                  <div
                    key={i}
                    className={`${i === 4 ? "bg-primary shadow-[0_0_10px_rgba(92,94,98,0.2)]" : "bg-secondary-fixed-dim"} w-full rounded-t-sm`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Demos Today */}
            <div className="glass-panel p-stack-md rounded-3xl ambient-shadow group hover:scale-[1.01] transition-transform duration-300">
              <span className="text-label-caps font-bold tracking-widest text-on-secondary-fixed-variant mb-4 block uppercase">
                Demos Today
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[40px] font-semibold text-primary">
                  {data ? data.stats.demosToday : "—"}
                </span>
                <div className="flex items-center gap-1 text-tertiary text-label-caps font-bold bg-tertiary-container px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>Live</span>
                </div>
              </div>
              <div className="mt-4 h-12 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {[20, 45, 55, 30, 65].map((h, i) => (
                  <div
                    key={i}
                    className={`${i === 4 ? "bg-tertiary shadow-[0_0_10px_rgba(78,96,119,0.2)]" : "bg-tertiary-fixed-dim"} w-full rounded-t-sm`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Admissions */}
            <div className="glass-panel p-stack-md rounded-3xl ambient-shadow group hover:scale-[1.01] transition-transform duration-300">
              <span className="text-label-caps font-bold tracking-widest text-on-secondary-fixed-variant mb-4 block uppercase">
                Admissions
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[40px] font-semibold text-primary">
                  {data ? data.stats.admissions : "—"}
                </span>
                <div className="flex items-center gap-1 text-error text-label-caps font-bold bg-error-container px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                  <span>3%</span>
                </div>
              </div>
              <div className="mt-4 h-12 w-full flex items-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {[80, 60, 70, 50, 40].map((h, i) => (
                  <div
                    key={i}
                    className={`${i === 4 ? "bg-error shadow-[0_0_10px_rgba(186,26,26,0.2)]" : "bg-error-container"} w-full rounded-t-sm`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Quick nav to CRM */}
          <div className="flex gap-gutter">
            <button
              onClick={() => navigate("crm")}
              className="flex items-center gap-3 glass-panel px-6 py-3 rounded-2xl hover:bg-white/90 transition-all ambient-shadow group"
            >
              <span className="material-symbols-outlined text-primary">view_kanban</span>
              <span className="text-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                Open CRM Board
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">arrow_forward</span>
            </button>
          </div>

          {/* Branch Health */}
          <section className="space-y-stack-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 font-medium text-on-surface">Branch Health</h2>
              <button className="text-primary text-label-caps font-bold tracking-widest hover:underline uppercase">
                View All Branches
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(data?.branches ?? [
                { name: "West Midtown Campus", subtitle: "Primary Academic Hub", score: 94, status: "excellent" as const },
                { name: "Riverside Learning Center", subtitle: "Vocational Training Wing", score: 78, status: "stable" as const },
                { name: "Downtown Prep Academy", subtitle: "Undergoing Maintenance", score: 62, status: "attention" as const },
              ]).map((branch, i) => {
                const cfg = STATUS_CONFIG[branch.status];
                return (
                  <div
                    key={i}
                    className="bg-white/40 border border-white/60 p-6 rounded-3xl flex items-center justify-between ambient-shadow hover:bg-white/60 transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="h-12 w-12 rounded-xl bg-primary-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">{BRANCH_ICONS[i]}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-lg text-on-surface">{branch.name}</span>
                        <p className="text-on-surface-variant text-sm">{branch.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 md:gap-12">
                      <div className="text-right">
                        <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                          Health Score
                        </span>
                        <span className="font-mono font-semibold text-xl text-primary">
                          {branch.score}<span className="text-sm font-normal text-on-surface-variant">/100</span>
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 ${cfg.bg} ${cfg.text} rounded-full border ${cfg.border}`}>
                        <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                        <span className="text-xs font-bold tracking-wider">{cfg.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* AI Briefing Sidebar (3 cols) */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="glass-panel rounded-[32px] h-[calc(100vh-160px)] sticky top-32 flex flex-col overflow-hidden ambient-shadow border border-white/80">
            <div className="p-6 border-b border-surface-container-highest flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <h2 className="font-semibold text-xl text-on-surface">AI Briefing</h2>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {(data?.insights ?? [
                { type: "insight" as const, time: "08:45 AM", text: "Admissions at Riverside are pacing 15% higher than last month. Consider reallocating the marketing budget from Downtown for the next sprint." },
                { type: "alert" as const, time: "09:12 AM", text: "Fee collection risk at Downtown Prep. 3 students have overdue payments older than 25 days." },
                { type: "action" as const, time: "Just Now", text: "How can I help you optimize operations today?" },
              ]).map((insight, i) => {
                const cfg = INSIGHT_TYPE_CONFIG[insight.type];
                return (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${cfg.bg} ${cfg.text} px-2 py-0.5 rounded`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">{insight.time}</span>
                    </div>
                    <div className={`bg-surface-container-low p-4 rounded-2xl rounded-tl-none text-sm text-on-surface-variant leading-relaxed ${insight.type === "action" ? "italic" : ""}`}>
                      {insight.text}
                    </div>
                    {insight.type === "insight" && (
                      <div className="flex gap-2">
                        <button className="text-xs font-semibold text-primary px-3 py-1 bg-white border border-outline-variant rounded-full hover:bg-primary-container transition-colors">
                          Apply Strategy
                        </button>
                        <button className="text-xs font-semibold text-on-surface-variant px-3 py-1 bg-white border border-outline-variant rounded-full hover:bg-surface-container transition-colors">
                          Details
                        </button>
                      </div>
                    )}
                    {insight.type === "alert" && (
                      <button className="text-xs font-semibold text-error px-3 py-1 bg-white border border-error-container rounded-full hover:bg-error-container transition-colors">
                        Schedule Meeting
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Chat input */}
            <div className="p-6 bg-white/40 border-t border-surface-container-highest">
              <div className="relative">
                <input
                  className="w-full bg-white border border-outline-variant rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none pr-12 shadow-inner"
                  placeholder="Ask AI anything..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button className="absolute right-2 top-2 h-8 w-8 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:shadow-lg transition-shadow">
                  <span className="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
