import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../App";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  course_interest: string;
  status: "new" | "contacted" | "demo" | "admitted" | "lost";
  priority: "normal" | "high";
  counselor: string;
  notes: string | null;
  demo_date: string | null;
  created_at: string;
}

const COLUMNS: { key: Lead["status"]; label: string; color: string; glow: string }[] = [
  { key: "new", label: "New Leads", color: "bg-blue-400", glow: "shadow-[0_0_8px_rgba(96,165,250,0.6)]" },
  { key: "contacted", label: "Contacted", color: "bg-amber-400", glow: "shadow-[0_0_8px_rgba(251,191,36,0.6)]" },
  { key: "demo", label: "Demo Booked", color: "bg-purple-400", glow: "shadow-[0_0_8px_rgba(192,132,252,0.6)]" },
  { key: "admitted", label: "Admitted", color: "bg-emerald-400", glow: "shadow-[0_0_8px_rgba(52,211,153,0.6)]" },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function LeadCard({ lead, onMove }: { lead: Lead; onMove: (id: number, status: Lead["status"]) => void }) {
  const isAdmitted = lead.status === "admitted";

  return (
    <div className={`glass-panel p-stack-sm rounded-xl shadow-sm hover:shadow-xl hover:scale-[1.01] hover:bg-white transition-all cursor-pointer group ${isAdmitted ? "border-l-4 border-l-emerald-400" : ""}`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-lg font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
          {lead.name}
        </span>
        <span className="font-mono text-[11px] text-outline">{timeAgo(lead.created_at)}</span>
      </div>

      {lead.course_interest && (
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`${isAdmitted ? "bg-emerald-100 text-emerald-700" : "bg-tertiary/10 text-tertiary"} px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase`}>
            {lead.course_interest}
          </span>
          {lead.priority === "high" && (
            <span className="bg-error-container text-error px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase">
              HIGH
            </span>
          )}
        </div>
      )}

      {lead.demo_date && (
        <div className="bg-primary-container p-3 rounded-lg flex items-center gap-3 mb-3">
          <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
          <div>
            <span className="text-xs font-bold text-on-primary-container">{lead.demo_date}</span>
            <span className="text-[10px] text-on-primary-container/70 block">Demo Scheduled</span>
          </div>
        </div>
      )}

      {lead.notes && (
        <div className="flex items-center gap-2 text-sm text-on-surface-variant mb-3">
          <span className="material-symbols-outlined text-base">call</span>
          <span>{lead.notes}</span>
        </div>
      )}

      {isAdmitted && (
        <div className="flex items-center gap-2 text-emerald-600 mb-3 font-medium text-sm">
          <span className="material-symbols-outlined text-lg">verified</span>
          <span>Enrolment Completed</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-white/50">
        <div className="flex gap-2 text-outline">
          {lead.counselor && (
            <span className="text-[11px] font-bold bg-surface-container px-2 py-1 rounded-full text-on-surface-variant uppercase tracking-wider">
              {lead.counselor}
            </span>
          )}
        </div>
        {/* Move to next stage */}
        {lead.status !== "admitted" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const next = { new: "contacted", contacted: "demo", demo: "admitted" } as const;
              onMove(lead.id, next[lead.status as keyof typeof next]);
            }}
            className="text-[11px] font-bold text-primary px-3 py-1 rounded-full border border-primary/30 hover:bg-primary hover:text-on-primary transition-colors"
          >
            Move →
          </button>
        )}
      </div>
    </div>
  );
}

interface AddLeadModalProps {
  onClose: () => void;
  onAdd: (lead: Partial<Lead>) => void;
}

function AddLeadModal({ onClose, onAdd }: AddLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [counselor, setCounselor] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="glass-panel rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 font-semibold text-on-surface">Add New Lead</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="space-y-4">
          {[
            { label: "Full Name *", val: name, set: setName, placeholder: "Student name", type: "text" },
            { label: "Phone", val: phone, set: setPhone, placeholder: "+91 98765 43210", type: "tel" },
            { label: "Email", val: email, set: setEmail, placeholder: "student@example.com", type: "email" },
            { label: "Course Interest", val: course, set: setCourse, placeholder: "IIT JEE, NEET, CA...", type: "text" },
            { label: "Counselor", val: counselor, set: setCounselor, placeholder: "Assigned counselor", type: "text" },
          ].map(({ label, val, set, placeholder, type }) => (
            <div key={label}>
              <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase mb-1 block">
                {label}
              </label>
              <input
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder={placeholder}
                type={type}
                value={val}
                onChange={(e) => set(e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
            Cancel
          </button>
          <button
            disabled={!name.trim()}
            onClick={() => onAdd({ name, phone, email, course_interest: course, counselor, status: "new" })}
            className="flex-1 py-3 rounded-xl mesh-gradient-primary text-on-primary font-semibold hover:opacity-95 transition-all disabled:opacity-50"
          >
            Add Lead
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CrmPage() {
  const { token } = useApp();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/leads", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setLeads(d.leads ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const moveLeadStatus = async (id: number, status: Lead["status"]) => {
    const res = await fetch(`/api/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (data.lead) {
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
    }
  };

  const addLead = async (leadData: Partial<Lead>) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(leadData),
    });
    const data = await res.json();
    if (data.lead) {
      setLeads((prev) => [data.lead, ...prev]);
      setShowAdd(false);
    }
  };

  const filtered = leads.filter((l) =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.course_interest?.toLowerCase().includes(search.toLowerCase()) ||
    l.phone?.includes(search)
  );

  return (
    <div className="min-h-screen text-on-surface" style={{ background: "#F1F5F9" }}>
      <Navbar />

      <main className="pt-32 pb-stack-lg px-margin-page max-w-container-max mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-gutter">
          <div>
            <span className="text-label-caps font-bold tracking-widest text-tertiary mb-2 block uppercase">
              Enrolment Funnel
            </span>
            <h1 className="text-h1 font-semibold text-on-surface-variant" style={{ letterSpacing: "-0.02em" }}>
              Student CRM Board
            </h1>
          </div>
          <div className="flex gap-stack-sm items-center">
            {/* Search */}
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-lg">search</span>
              <input
                className="bg-white/80 border-none rounded-full pl-10 pr-6 py-2 w-56 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg border border-outline-variant/30 text-body-md font-medium text-secondary hover:bg-white/90 transition-all">
              <span className="material-symbols-outlined text-xl">filter_list</span>
              Filters
            </button>
          </div>
        </div>

        {/* Kanban columns */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mr-3">refresh</span>
            Loading leads...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter items-start">
            {COLUMNS.map((col) => {
              const colLeads = filtered.filter((l) => l.status === col.key);
              return (
                <div key={col.key} className="flex flex-col gap-stack-md">
                  {/* Column header */}
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${col.color} ${col.glow}`} />
                      <h3 className="text-h3 font-medium text-on-surface-variant">{col.label}</h3>
                    </div>
                    <span className="bg-surface-container-high px-2.5 py-0.5 rounded-full text-label-caps font-bold text-secondary">
                      {String(colLeads.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-stack-sm p-2 rounded-xl bg-slate-200/20 min-h-[400px]">
                    {colLeads.length === 0 ? (
                      <div className="flex items-center justify-center h-20 text-sm text-on-surface-variant/50 italic">
                        No leads
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} onMove={moveLeadStatus} />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-40">
        <button
          onClick={() => setShowAdd(true)}
          className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center scale-95 active:scale-90 transition-transform hover:shadow-primary/30"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>
      </div>

      {/* Add Lead Modal */}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onAdd={addLead} />}
    </div>
  );
}
