import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { useApp } from "../App";

interface Student {
  id: number;
  admission_number: string;
  lead_id: number | null;
  name: string;
  email: string | null;
  phone: string | null;
  course: string | null;
  batch: string | null;
  counselor: string | null;
  status: "active" | "dropped" | "completed";
  fee_total: number;
  fee_paid: number;
  enrolled_at: string;
}

interface Stats {
  total: number;
  active: number;
  dropped: number;
  feePending: number;
}

const STATUS_STYLES = {
  active: "bg-green-50 text-green-700 border border-green-100",
  dropped: "bg-red-50 text-error border border-red-100",
  completed: "bg-tertiary-container text-tertiary border border-tertiary-fixed-dim",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

// ── Profile Drawer ──────────────────────────────────────────────────────────

function StudentDrawer({
  student,
  onClose,
  onUpdate,
}: {
  student: Student;
  onClose: () => void;
  onUpdate: (s: Student) => void;
}) {
  const { token } = useApp();
  const [status, setStatus] = useState(student.status);
  const [feePaid, setFeePaid] = useState(String(student.fee_paid));
  const [saving, setSaving] = useState(false);
  const pending = student.fee_total - student.fee_paid;

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, fee_paid: parseFloat(feePaid) || 0 }),
    });
    const data = await res.json();
    if (data.student) onUpdate(data.student);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-y-auto animate-[slideIn_0.2s_ease-out]">
        {/* Header */}
        <div className="p-6 border-b border-surface-container-highest flex items-center justify-between bg-primary-container">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center text-xl font-bold">
              {initials(student.name)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-on-surface">{student.name}</h2>
              <span className="text-xs font-bold tracking-widest text-primary bg-primary-fixed px-2 py-0.5 rounded-full">
                {student.admission_number}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-2">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase mb-2 block">
              Status
            </label>
            <select
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={status}
              onChange={(e) => setStatus(e.target.value as Student["status"])}
            >
              <option value="active">Active</option>
              <option value="dropped">Dropped</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase block">
              Contact
            </label>
            {[
              { icon: "mail", val: student.email },
              { icon: "call", val: student.phone },
            ].map(({ icon, val }) => (
              <div key={icon} className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-lg text-primary">{icon}</span>
                <span className="text-body-md">{val ?? "—"}</span>
              </div>
            ))}
          </div>

          {/* Course & Batch */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Course", icon: "school", val: student.course },
              { label: "Batch", icon: "groups", val: student.batch },
              { label: "Counselor", icon: "person", val: student.counselor },
              { label: "Enrolled", icon: "calendar_today", val: student.enrolled_at?.slice(0, 10) },
            ].map(({ label, icon, val }) => (
              <div key={label} className="bg-surface-container-low rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary">{icon}</span>
                  <span className="text-[10px] font-bold tracking-widest text-on-tertiary-container uppercase">{label}</span>
                </div>
                <span className="text-sm font-medium text-on-surface">{val ?? "—"}</span>
              </div>
            ))}
          </div>

          {/* Fees */}
          <div className="bg-surface-container-low rounded-2xl p-4 space-y-3">
            <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase block">
              Fee Summary
            </label>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Total Fee</span>
              <span className="font-semibold text-on-surface">{fmt(student.fee_total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Paid</span>
              <span className="font-semibold text-green-600">{fmt(student.fee_paid)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-surface-container pt-2">
              <span className="text-on-surface-variant">Pending</span>
              <span className={`font-bold ${pending > 0 ? "text-error" : "text-green-600"}`}>
                {fmt(pending)}
              </span>
            </div>
            {/* Fee paid edit */}
            <div className="pt-2">
              <label className="text-[10px] font-bold tracking-widest text-on-tertiary-container uppercase mb-1 block">
                Update Amount Paid
              </label>
              <input
                type="number"
                className="w-full bg-white border border-outline-variant rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                value={feePaid}
                onChange={(e) => setFeePaid(e.target.value)}
                min={0}
                max={student.fee_total}
              />
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="p-6 border-t border-surface-container-highest">
          <button
            onClick={save}
            disabled={saving}
            className="w-full py-3 rounded-xl mesh-gradient-primary text-on-primary font-semibold hover:opacity-95 transition-all disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Enroll Modal ─────────────────────────────────────────────────────────────

function EnrollModal({ onClose, onEnrolled }: { onClose: () => void; onEnrolled: (s: Student) => void }) {
  const { token } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", email: "", course: "", batch: "", counselor: "", fee_total: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/students/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, fee_total: parseFloat(form.fee_total) || 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      onEnrolled(data.student);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="glass-panel rounded-3xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-h3 font-semibold text-on-surface">Enroll New Student</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">Admission number will be auto-generated</p>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && <div className="bg-error-container text-on-error-container px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {([
              ["name", "Full Name *", "text", "Student name"],
              ["phone", "Phone", "tel", "+91 98765 43210"],
              ["email", "Email", "email", "student@example.com"],
              ["course", "Course", "text", "IIT JEE, NEET, CA..."],
              ["batch", "Batch", "text", "Batch A - Morning"],
              ["counselor", "Counselor", "text", "Assigned counselor"],
            ] as const).map(([key, label, type, ph]) => (
              <div key={key}>
                <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase mb-1 block">{label}</label>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                  type={type} placeholder={ph} value={form[key]}
                  onChange={set(key)} required={key === "name"}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[11px] font-bold tracking-widest text-on-tertiary-container uppercase mb-1 block">Total Fee (₹)</label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              type="number" placeholder="45000" value={form.fee_total}
              onChange={set("fee_total")} min={0}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl mesh-gradient-primary text-on-primary font-semibold hover:opacity-95 transition-all disabled:opacity-60">
              {saving ? "Enrolling..." : "Enroll Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const { token } = useApp();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, dropped: 0, feePending: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [showEnroll, setShowEnroll] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = (s = search, sf = statusFilter) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (sf) params.set("status", sf);
    fetch(`/api/students?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { setStudents(d.students ?? []); setStats(d.stats ?? {}); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load(v, statusFilter), 300);
  };

  const handleStatusFilter = (v: string) => {
    setStatusFilter(v);
    load(search, v);
  };

  const handleUpdate = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelected(updated);
  };

  const handleEnrolled = (s: Student) => {
    setStudents((prev) => [s, ...prev]);
    setStats((st) => ({ ...st, total: st.total + 1, active: st.active + 1 }));
    setShowEnroll(false);
    setSelected(s);
  };

  const exportCsv = () => {
    const headers = ["Admission No.", "Name", "Phone", "Email", "Course", "Batch", "Counselor", "Status", "Fee Total", "Fee Paid", "Pending", "Enrolled"];
    const rows = students.map((s) => [
      s.admission_number, s.name, s.phone ?? "", s.email ?? "",
      s.course ?? "", s.batch ?? "", s.counselor ?? "", s.status,
      s.fee_total, s.fee_paid, s.fee_total - s.fee_paid, s.enrolled_at?.slice(0, 10),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
  };

  return (
    <div className="min-h-screen bg-background mesh-bg text-on-surface">
      <Navbar />

      <main className="pt-32 pb-stack-lg max-w-container-max mx-auto px-margin-page">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-4">
          <div>
            <span className="text-label-caps font-bold tracking-widest text-tertiary mb-2 block uppercase">
              Student Directory
            </span>
            <h1 className="text-h1 font-semibold text-on-surface" style={{ letterSpacing: "-0.02em" }}>
              Students
            </h1>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCsv}
              className="flex items-center gap-2 glass-panel px-4 py-2.5 rounded-xl border border-outline-variant/30 text-sm font-medium text-secondary hover:bg-white/90 transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              Export CSV
            </button>
            <button onClick={() => setShowEnroll(true)}
              className="flex items-center gap-2 mesh-gradient-primary text-on-primary px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-95 transition-all shadow-lg">
              <span className="material-symbols-outlined text-lg">person_add</span>
              Enroll Student
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-stack-lg">
          {[
            { label: "Total Students", value: stats.total, icon: "school", color: "text-primary", bg: "bg-primary-container" },
            { label: "Active", value: stats.active, icon: "how_to_reg", color: "text-green-600", bg: "bg-green-50" },
            { label: "Dropped", value: stats.dropped, icon: "person_remove", color: "text-error", bg: "bg-error-container" },
            { label: "Fee Pending", value: "₹" + (stats.feePending / 1000).toFixed(0) + "k", icon: "payments", color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="glass-panel p-stack-md rounded-2xl ambient-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold tracking-widest text-on-secondary-fixed-variant uppercase">{label}</span>
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
                </div>
              </div>
              <span className={`font-mono text-3xl font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-lg">search</span>
            <input
              className="w-full bg-white border border-outline-variant rounded-xl pl-10 pr-4 py-2.5 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search by name, phone, email, course, admission no..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-white border border-outline-variant rounded-xl px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-36"
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="dropped">Dropped</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin mr-3">refresh</span>
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant gap-3">
            <span className="material-symbols-outlined text-5xl text-outline-variant">school</span>
            <p className="text-body-lg">No students found</p>
            <button onClick={() => setShowEnroll(true)}
              className="text-primary font-semibold hover:underline text-sm">
              Enroll the first student →
            </button>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/80 overflow-hidden ambient-shadow">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1.2fr_1.4fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-surface-container-low border-b border-surface-container-highest">
              {["Student", "Admission No.", "Course / Batch", "Counselor", "Status", "Fee Status", ""].map((h) => (
                <span key={h} className="text-[10px] font-bold tracking-widest text-on-tertiary-container uppercase">{h}</span>
              ))}
            </div>

            {/* Rows */}
            {students.map((s) => {
              const pending = s.fee_total - s.fee_paid;
              const pct = s.fee_total > 0 ? Math.round((s.fee_paid / s.fee_total) * 100) : 0;
              return (
                <div
                  key={s.id}
                  className="grid grid-cols-[2fr_1.2fr_1.4fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-surface-container/50 hover:bg-white/80 transition-colors cursor-pointer items-center"
                  onClick={() => setSelected(s)}
                >
                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center text-xs font-bold shrink-0">
                      {initials(s.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface text-sm truncate">{s.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{s.phone ?? s.email ?? "—"}</p>
                    </div>
                  </div>

                  {/* Admission no */}
                  <span className="text-xs font-bold text-primary bg-primary-container px-2 py-1 rounded-full w-fit">
                    {s.admission_number}
                  </span>

                  {/* Course / Batch */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{s.course ?? "—"}</p>
                    <p className="text-xs text-on-surface-variant truncate">{s.batch ?? "—"}</p>
                  </div>

                  {/* Counselor */}
                  <span className="text-sm text-on-surface-variant truncate">{s.counselor ?? "—"}</span>

                  {/* Status badge */}
                  <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-full w-fit uppercase ${STATUS_STYLES[s.status]}`}>
                    {s.status}
                  </span>

                  {/* Fee */}
                  <div className="min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={pending > 0 ? "text-error font-semibold" : "text-green-600 font-semibold"}>
                        {pending > 0 ? `₹${(pending / 1000).toFixed(0)}k due` : "Paid"}
                      </span>
                      <span className="text-on-surface-variant">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container rounded-full overflow-hidden w-24">
                      <div
                        className={`h-full rounded-full ${pct === 100 ? "bg-green-500" : pct > 50 ? "bg-amber-400" : "bg-error"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Action */}
                  <button className="text-on-surface-variant hover:text-primary p-1" onClick={(e) => { e.stopPropagation(); setSelected(s); }}>
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-xs text-on-surface-variant mt-4 text-right">
          {students.length} student{students.length !== 1 ? "s" : ""} shown
        </p>
      </main>

      {selected && (
        <StudentDrawer
          student={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}

      {showEnroll && (
        <EnrollModal
          onClose={() => setShowEnroll(false)}
          onEnrolled={handleEnrolled}
        />
      )}
    </div>
  );
}
