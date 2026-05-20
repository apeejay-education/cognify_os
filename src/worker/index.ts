import { app, migrate, db } from "flingit";

// --- Helpers ---

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "cognify_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getBearerToken(c: { req: { header: (h: string) => string | undefined } }): string | undefined {
  const auth = c.req.header("Authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return undefined;
}

async function getSessionUser(token: string | undefined) {
  if (!token) return null;
  const session = await db
    .prepare("SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')")
    .bind(token)
    .first<{ user_id: number }>();
  if (!session) return null;
  return await db
    .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
    .bind(session.user_id)
    .first<{ id: number; name: string; email: string; role: string }>();
}

// --- Migrations ---

migrate("001_create_users", async () => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
});

migrate("002_create_sessions", async () => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
});

migrate("003_create_leads", async () => {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      course_interest TEXT,
      status TEXT DEFAULT 'new',
      priority TEXT DEFAULT 'normal',
      counselor TEXT,
      notes TEXT,
      demo_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `).run();
});

migrate("004_seed_demo_data", async () => {
  // Demo owner account
  const existing = await db
    .prepare("SELECT id FROM users WHERE email = 'owner@cognify.app'")
    .first();
  if (!existing) {
    const hash = await hashPassword("cognify2024");
    await db
      .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)")
      .bind("Anand Arora", "owner@cognify.app", hash, "owner")
      .run();
  }

  // Demo leads
  const count = await db
    .prepare("SELECT COUNT(*) as n FROM leads")
    .first<{ n: number }>();
  if (count && count.n === 0) {
    const leads = [
      ["Julianne Vora", "julianne@example.com", "+91 98765 43210", "Advanced AI", "new", "normal", "Priya S.", null, null],
      ["Marcus Sterling", "marcus@example.com", "+91 87654 32109", "UI/UX Design", "new", "high", "Rahul M.", null, null],
      ["Priya Sharma", "priya@example.com", "+91 76543 21098", "IIT JEE", "new", "normal", "Rahul M.", null, null],
      ["Arjun Patel", "arjun@example.com", "+91 65432 10987", "NEET Prep", "new", "normal", "Priya S.", null, null],
      ["Elara Vance", "elara@example.com", "+91 54321 09876", "Neuroscience", "contacted", "normal", "Priya S.", "Pending callback", null],
      ["Rohan Gupta", "rohan@example.com", "+91 43210 98765", "CA Foundation", "contacted", "high", "Rahul M.", null, null],
      ["Sneha Verma", "sneha@example.com", "+91 32109 87654", "UPSC Prep", "contacted", "normal", "Priya S.", null, null],
      ["Adrian Thorne", "adrian@example.com", "+91 21098 76543", "Machine Learning", "demo", "normal", "Rahul M.", null, "May 24, 14:00"],
      ["Kavya Reddy", "kavya@example.com", "+91 10987 65432", "IIT JEE Advanced", "demo", "high", "Priya S.", null, "May 22, 11:00"],
      ["Vikram Singh", "vikram@example.com", "+91 09876 54321", "Data Science", "demo", "normal", "Rahul M.", null, "May 23, 16:00"],
      ["Sophie Chen", "sophie@example.com", "+91 98765 43211", "Data Science", "admitted", "normal", "Priya S.", null, null],
      ["Amit Kumar", "amit@example.com", "+91 87654 32100", "NEET Prep", "admitted", "normal", "Rahul M.", null, null],
      ["Deepika Nair", "deepika@example.com", "+91 76543 21099", "CA IPCC", "admitted", "normal", "Priya S.", null, null],
    ];
    for (const [name, email, phone, course, status, priority, counselor, notes, demo_date] of leads) {
      await db
        .prepare("INSERT INTO leads (name, email, phone, course_interest, status, priority, counselor, notes, demo_date) VALUES (?,?,?,?,?,?,?,?,?)")
        .bind(name, email, phone, course, status, priority, counselor, notes, demo_date)
        .run();
    }
  }
});

// --- Auth routes ---

app.post("/api/auth/login", async (c) => {
  const body = await c.req.json<{ email: string; password: string }>();
  if (!body.email || !body.password) {
    return c.json({ error: "Email and password required" }, 400);
  }
  const hash = await hashPassword(body.password);
  const user = await db
    .prepare("SELECT id, name, email, role FROM users WHERE LOWER(email) = LOWER(?) AND password_hash = ?")
    .bind(body.email.trim(), hash)
    .first<{ id: number; name: string; email: string; role: string }>();
  if (!user) return c.json({ error: "Invalid email or password" }, 401);

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .replace("T", " ")
    .slice(0, 19);
  await db
    .prepare("INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)")
    .bind(user.id, token, expires)
    .run();

  return c.json({ token, user: { name: user.name, email: user.email, role: user.role } });
});

app.get("/api/auth/me", async (c) => {
  const user = await getSessionUser(getBearerToken(c));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ user: { name: user.name, email: user.email, role: user.role } });
});

app.post("/api/auth/logout", async (c) => {
  const token = getBearerToken(c);
  if (token) await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
  return c.json({ ok: true });
});

// --- Dashboard ---

app.get("/api/dashboard", async (c) => {
  const user = await getSessionUser(getBearerToken(c));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const [total, demos, admitted] = await Promise.all([
    db.prepare("SELECT COUNT(*) as n FROM leads").first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) as n FROM leads WHERE status = 'demo'").first<{ n: number }>(),
    db.prepare("SELECT COUNT(*) as n FROM leads WHERE status = 'admitted'").first<{ n: number }>(),
  ]);

  return c.json({
    stats: {
      totalLeads: total?.n ?? 0,
      demosToday: demos?.n ?? 0,
      admissions: admitted?.n ?? 0,
    },
    branches: [
      { name: "West Midtown Campus", subtitle: "Primary Academic Hub", score: 94, status: "excellent" },
      { name: "Riverside Learning Center", subtitle: "Vocational Training Wing", score: 78, status: "stable" },
      { name: "Downtown Prep Academy", subtitle: "Undergoing Maintenance", score: 62, status: "attention" },
    ],
    insights: [
      { type: "insight", time: "08:45 AM", text: "Admissions at Riverside are pacing 15% higher than last month. Consider reallocating marketing budget from Downtown." },
      { type: "alert", time: "09:12 AM", text: "Fee collection risk at Downtown Prep. 3 students have overdue payments older than 25 days." },
      { type: "action", time: "Just Now", text: "How can I help you optimize operations today?" },
    ],
    user: { name: user.name, email: user.email },
  });
});

// --- Leads / CRM ---

app.get("/api/leads", async (c) => {
  const user = await getSessionUser(getBearerToken(c));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const result = await db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  return c.json({ leads: result.results ?? [] });
});

app.post("/api/leads", async (c) => {
  const user = await getSessionUser(getBearerToken(c));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json<{
    name: string; email?: string; phone?: string;
    course_interest?: string; status?: string; counselor?: string;
  }>();
  if (!body.name?.trim()) return c.json({ error: "Name required" }, 400);

  const result = await db
    .prepare("INSERT INTO leads (name, email, phone, course_interest, status, counselor) VALUES (?,?,?,?,?,?)")
    .bind(body.name, body.email ?? null, body.phone ?? null, body.course_interest ?? null, body.status ?? "new", body.counselor ?? null)
    .run();

  const lead = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(result.meta.last_row_id).first();
  return c.json({ lead }, 201);
});

app.patch("/api/leads/:id/status", async (c) => {
  const user = await getSessionUser(getBearerToken(c));
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const { status } = await c.req.json<{ status: string }>();
  await db.prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, id).run();
  const lead = await db.prepare("SELECT * FROM leads WHERE id = ?").bind(id).first();
  return c.json({ lead });
});
