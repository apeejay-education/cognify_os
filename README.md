# Cognify — AI-Powered Education Business OS

> **"Run your education business. Own your growth."**

Cognify is the all-in-one operating system for non-school education businesses in India — replacing 6+ disconnected tools (WhatsApp, Excel, Google Forms, Razorpay, Zoom, Instagram DMs) with a single intelligent platform.

**Phase 1 target:** Coaching center owners running single or multi-branch operations (IIT/NEET, CA, UPSC, K-12, skill-based).

🚀 **Live demo:** [https://proj-69wbky.flingit.run](https://proj-69wbky.flingit.run)  
🔑 **Demo login:** `owner@cognify.app` / `cognify2024`

---

## What's Live Today

This repository contains the **Cognify web app**, built on [Fling](https://flingit.io) (React + Hono + SQLite/D1 + Cloudflare Workers).

| Screen | Status | Description |
|--------|--------|-------------|
| Login | ✅ Live | Glass-panel split layout, session-based auth |
| Owner Dashboard | ✅ Live | Stats cards, branch health, AI briefing sidebar |
| CRM Kanban | ✅ Live | 4-column pipeline, add leads, move stages |

---

## Product Vision & PRD

Cognify is built in **4 phases** over ~37 months:

| Phase | Timeline | Scope |
|-------|----------|-------|
| **Phase 1** | Months 1–6 | Coaching Center OS (offline, online, blended, multi-branch) |
| **Phase 2** | Months 7–18 | Online Education OS (solo tutors, course creators, enhanced LMS) |
| **Phase 3** | Months 19–36 | University / Institution OS — HEERP (NAAC, NBA, UGC compliance) |
| **Phase 4** | Months 37+ | Enterprise & Franchise (corporate L&D, white-labeling, royalty tracking) |

**Core Phase 1 promise:** The owner should not discover business problems manually. Cognify surfaces important facts and suggested actions automatically — every morning via WhatsApp, and in real time on the dashboard.

**Full PRD:** `_bmad-output/planning-artifacts/prd/Phase 1/`  
**Executive Summary:** [`00-executive-prd.md`](_bmad-output/planning-artifacts/prd/Phase%201/00-executive-prd.md)

---

## Platform Architecture — 6 Modules

```
┌─────────────────────────────────────────────────────────┐
│                        COGNIFY                          │
├──────────┬──────────┬──────────┬──────────┬─────────────┤
│  LEARN   │  MANAGE  │  ENGAGE  │  MARKET  │  INSIGHTS   │
│  (LMS)   │  (ERP)   │  (CRM)   │  (Auto)  │  (Owner     │
│          │          │          │          │  Intel)     │
└──────────┴──────────┴──────────┴──────────┴─────────────┘
                           AI LAYER (Phase 1.5)
```

| Module | What it does |
|--------|-------------|
| **LEARN** | Course builder, Bunny.net video CDN, quizzes, attendance, certificates |
| **MANAGE** | Batch scheduling, fee management, Razorpay integration, EMI tracking |
| **ENGAGE** | Lead capture forms, CRM pipeline, counselor tasks, parent intelligence |
| **MARKET** | WhatsApp campaigns (Meta Cloud API), bulk email (Amazon SES), audience segments |
| **INSIGHTS** | Branch health score (1–100), counselor performance, lead source ROI |
| **AI LAYER** | Daily 8AM WhatsApp brief, dropout risk scoring, counselor coaching nudges |

---

## Epics & Sprint Status

### Epic 0: Platform Foundation ✅ Done
Multi-tenant `org_id` isolation via Supabase RLS, RBAC (owner/counselor/instructor/student/parent), event sourcing tables (`business_events`, `webhook_events`, `job_runs`).

Stories: `0.1` Multi-Tenant RLS ✅ · `0.2` RBAC ✅ · `0.3` Event Sourcing Tables ✅

---

### Epic 1: Guided Onboarding ✅ Done
Signup with coaching mode selection (Offline/Online/Blended), 4-step onboarding wizard, simulated "Aha" daily brief for new users, Supabase auth fixes.

Stories: `1.1` Signup & Mode Selection ✅ · `1.2` Aha Onboarding Wizard ✅ · `1.3` Auth Fix ✅

---

### Epic 2: Institute Setup & Batch Management 🔄 In Progress
Multi-branch + course catalog creation, batch timetables, faculty attendance, student ID card generation (PDF, print-ready).

Stories: `2.1` Multi-Branch & Course Config ✅ · `2.2` Batch Scheduling & Faculty Attendance ✅ · `2.3` Student Directory & ID Cards 🔜 **Ready for Dev**

---

### Epic 3: Lead Acquisition & CRM 📋 Backlog
Embeddable lead capture forms with UTM tracking, CRM Kanban with global search, duplicate detection, counselor task reminders, parent intelligence layer, Lead Source ROI dashboard.

Stories: `3.1` Embeddable Forms & UTM ROI · `3.2` Kanban CRM with Global Search

---

### Epic 4: Admissions & Fee Management 📋 Backlog
Lead-to-student conversion, sequential admission numbers, fee structures, EMI options, Razorpay webhook with HMAC-SHA256 idempotency, bulk batch shift, defaulter reports.

Stories: `4.1` Enrollment & Admission Numbers · `4.2` Bulk Batch Shift & Student Edits · `4.3` Razorpay Webhook Idempotency

---

### Epic 5: Class Delivery & LMS 📋 Backlog
Course builder (video/PDF/text), student progress tracking, MCQ + subjective quizzes, QR-based + manual attendance, auto certificate generation.

Stories: `5.1` QR + Manual Attendance with Override

---

### Epic 6: Automated Marketing & Communication 📋 Backlog
WhatsApp campaigns (Meta Cloud API), payment reminder automation, bulk email (Amazon SES), durable notification queue with retry, batch fill optimization.

Stories: `6.1` Durable Notification Queue

---

### Epic 7: Owner Intelligence & Analytics 📋 Backlog
Branch health score (composite daily: leads 30% + demos 25% + fees 25% + attendance 20%), counselor performance dashboard, daily 8AM bilingual WhatsApp brief, Claude-powered AI action recommendations.

Stories: `7.1` Daily 8AM WhatsApp Brief (Bilingual AI)

---

### Epic 8: Unified Mobile App 📋 Backlog
One React Native app (Expo + EAS) with role-based views for Owner, Counselor, Educator, Student, Parent. iOS + Android. Offline-read support.

Stories: `8.1` Unified React Native App · `8.2` Standardized UX States & Offline Read

---

## Design References

All screen designs are HTML prototypes built with Tailwind CSS and the Cognify design system (Outfit typeface, Material Symbols, glass-panel components).

| Screen | File | Status |
|--------|------|--------|
| Login / Signup | [`designs/new_login.html`](designs/new_login.html) | ✅ Implemented |
| Owner Dashboard | [`designs/dashboard_owner.html`](designs/dashboard_owner.html) | ✅ Implemented |
| CRM Kanban | [`designs/crm_new.html`](designs/crm_new.html) | ✅ Implemented |
| Landing Page | [`designs/new_landing.html`](designs/new_landing.html) | 🔜 Not started |
| Design System | [`designs/newdesignsystem.md`](designs/newdesignsystem.md) | Reference |
| Moodboard | [`designs/moodboard.md`](designs/moodboard.md) | Reference |
| Design Specs | [`designs/DESIGN_SPECIFICATIONS.md`](designs/DESIGN_SPECIFICATIONS.md) | Reference |

**Design tokens:** Outfit (headings + body), JetBrains Mono (numbers), Material Symbols Outlined (icons). Primary `#5c5e62`, Tertiary `#4e6077`.

---

## Next 8–10 Tasks

These are the immediate next tasks in priority order, sequenced to unlock each other:

### 🔜 Task 1 — Student Directory & ID Card Preview (Story 2.3)
Build the student list view with search/filter, student profile page with admission details, and a print-ready PDF ID card generator.
**Unblocks:** Enrollment flow in Epic 4.

### 🔜 Task 2 — Signup Page & Multi-Tenant Org Creation
Add a real signup flow on the web app — email, org name, coaching mode selection (Offline/Online/Blended). Creates the `organizations` record and seeds the first branch.
**Unblocks:** All multi-tenant features.

### 🔜 Task 3 — Embeddable Lead Capture Forms with UTM Tracking (Story 3.1)
Shareable `/form/:org-slug` page that captures lead name, phone, course interest, and UTM parameters. Writes directly to the `leads` table with source attribution.
**Unblocks:** Lead Source ROI dashboard.

### 🔜 Task 4 — Full CRM with Global Search, Filters & Follow-up Tasks (Story 3.2)
Extend the current Kanban with: global search by name/phone/email, counselor-wise filter, follow-up task reminders, lead timeline/activity log, and a "Lost" column with reason field.
**Unblocks:** Counselor performance metrics in Epic 7.

### 🔜 Task 5 — Student Enrollment & Sequential Admission Numbers (Story 4.1)
Convert a "Admitted" CRM lead to a student record — auto-generate admission number (`ORG-YYYY-NNNN`), assign to batch, generate invoice, send WhatsApp confirmation.
**Unblocks:** Fee management, attendance.

### 🔜 Task 6 — Fee Management: Structures, EMI & Payment Tracking (Story 4.2 partial)
Fee structure builder per batch (full / installment / scholarship). Payment recording, outstanding balance tracker, defaulter flag (>25 days unpaid), and Excel export.
**Unblocks:** Razorpay integration, owner revenue dashboard.

### 🔜 Task 7 — Razorpay Webhook with HMAC-SHA256 + Idempotency (Story 4.3)
Secure `/api/webhooks/razorpay` endpoint with signature verification, `webhook_events` idempotency check, auto-payment status update, WhatsApp receipt via Meta Cloud API.
**Unblocks:** Automated payment reminders.

### 🔜 Task 8 — QR-Based + Manual Attendance (Story 5.1)
Daily session attendance: QR code generation per batch session, student self-check-in via QR scan, manual override by instructor, parent WhatsApp alert on absence.
**Unblocks:** Branch health score attendance component.

### 🔜 Task 9 — Branch Health Score & Owner Analytics Dashboard (Story 7.1 partial)
Nightly cron job to compute composite health score per branch (lead velocity 30% + demo conversion 25% + fee collection 25% + attendance 20%). Display trend graph on owner dashboard.
**Unblocks:** Daily WhatsApp brief content.

### 🔜 Task 10 — Daily 8AM WhatsApp Brief via Claude + Meta API (Story 7.1)
Cron job at 8AM IST: query yesterday's KPIs, generate a conversational summary via Claude API (gemini-2.0-flash primary), send to owner via Meta WhatsApp Cloud API with 3 action buttons.
**Unblocks:** Owner intelligence module, Phase 1.5 AI layer.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19 + Vite + Tailwind CSS v4 | App Router, Outfit typeface |
| Backend | Hono on Cloudflare Workers | `/api/*` routes |
| Database | SQLite (local) → Cloudflare D1 (prod) | Via Fling platform |
| Auth | Session tokens in D1 | SHA-256 hashed passwords |
| Hosting | [Fling](https://flingit.io) → Cloudflare Workers | `npx fling it` to deploy |
| Payments | Razorpay | UPI, EMI, cards (Epic 4) |
| WhatsApp | Meta WhatsApp Cloud API | PRIMARY — start registration Day 1 |
| Email | Resend (transactional) + Amazon SES (bulk) | |
| Video CDN | Bunny.net | Course video streaming (Epic 5) |
| AI Gateway | OpenRouter → Claude / Gemini / GPT-4o | Per-task model routing |
| Mobile | React Native + Expo + EAS | Epic 8, parallel to web |
| Production DB | Supabase (Postgres + RLS) | Mumbai `ap-south-1`, DPDPA required |

---

## Running Locally

```bash
git clone git@github.com:apeejay-education/cognify_os.git
cd cognify_os
npm install
npm start
```

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3210
- **Demo login:** `owner@cognify.app` / `cognify2024`

## Deploying

```bash
npx fling --cli it
```

Deploys to Cloudflare Workers. Live at [https://proj-69wbky.flingit.run](https://proj-69wbky.flingit.run).

---

## Critical Pre-Code Actions (Before Full Production)

1. **Start Meta WhatsApp Business Manager registration — Day 1.** 3–5 week approval lead time. Every WhatsApp-dependent feature is blocked until approval.
2. **DPDPA legal opinion on Supabase Mumbai (`ap-south-1`) — by end of Week 2.** Required before storing student data.
3. **Talk to 5 counselors at multi-branch coaching centers** before writing Epic 3–4 code.
4. **Submit all WhatsApp message templates for Meta pre-approval in Week 1** (5+ templates needed: payment reminder, receipt, enrollment confirmation, demo reminder, daily brief).

---

## Security Requirements (Launch Blockers)

- Razorpay webhooks: HMAC-SHA256 signature verification + `payment_id` idempotency check
- Meta WhatsApp webhooks: `X-Hub-Signature-256` header verification
- Cron monitoring: all jobs write to `job_runs` table; alert if >25 hours since last run
- Multi-tenancy: `org_id` RLS on every Supabase table — test rigorously before launch

---

*Built with [Fling](https://flingit.io) · Powered by Cloudflare Workers · AI by Claude (Anthropic)*
