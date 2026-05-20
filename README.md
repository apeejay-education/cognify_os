# Cognify — AI-Powered Education Business OS

> **"Run your education business. Own your growth."**

Cognify is the all-in-one operating system for non-school education businesses in India — replacing 6+ disconnected tools (WhatsApp, Excel, Google Forms, Razorpay, Zoom, Instagram DMs) with a single intelligent platform.

**Phase 1 target:** Coaching center owners running single or multi-branch operations (IIT/NEET, CA, UPSC, K-12, skill-based).

---

## Product Vision

Most education software serves operators — counselors, instructors, admins, accountants. Cognify's wedge is **owner intelligence**. The owner should not discover business problems manually. Cognify surfaces the important facts and suggested actions automatically — every morning, and in real time on the dashboard.

### Phase Roadmap

| Phase | Timeline | Scope |
|-------|----------|-------|
| **Phase 1** | Months 1–6 | Coaching Center OS — offline, online, blended, multi-branch |
| **Phase 2** | Months 7–18 | Online Education OS — solo tutors, course creators, enhanced LMS |
| **Phase 3** | Months 19–36 | University / Institution OS (NAAC, NBA, UGC, global accreditation) |
| **Phase 4** | Months 37+ | Enterprise & Franchise — corporate L&D, white-labeling, royalty tracking |

---

## Platform Architecture — 6 Modules

| Module | What it does |
|--------|-------------|
| **LEARN** | Course builder, video CDN, quizzes, attendance, auto certificates |
| **MANAGE** | Batch scheduling, fee management, Razorpay integration, EMI tracking |
| **ENGAGE** | Lead capture forms, CRM pipeline, counselor tasks, parent intelligence |
| **MARKET** | WhatsApp campaigns, payment reminders, bulk email, audience segments |
| **INSIGHTS** | Branch health score, counselor performance, lead source ROI dashboard |
| **AI LAYER** | Daily 8AM WhatsApp brief, dropout risk scoring, AI action recommendations |

---

## Epics & Status

### Epic 0: Platform Foundation ✅ Done
Multi-tenant data isolation, role-based access control (owner / counselor / instructor / student / parent), event sourcing and reliability tables.

### Epic 1: Guided Onboarding ✅ Done
Signup with coaching mode selection (Offline / Online / Blended), 4-step onboarding wizard, simulated "Aha" daily brief for new users, authentication.

### Epic 2: Institute Setup & Batch Management 🔄 In Progress
Multi-branch and course catalog creation, batch timetables, faculty attendance tracking. Student directory and ID card generation in progress.

### Epic 3: Lead Acquisition & CRM 📋 Backlog
Embeddable lead capture forms with UTM tracking, CRM Kanban with global search, counselor task reminders, parent intelligence layer, Lead Source ROI dashboard.

### Epic 4: Admissions & Fee Management 📋 Backlog
Lead-to-student conversion, sequential admission numbers, fee structures, EMI options, Razorpay payment integration, defaulter reports, bulk batch shift.

### Epic 5: Class Delivery & LMS 📋 Backlog
Course builder (video / PDF / text), student progress tracking, MCQ and subjective quizzes, QR-based and manual attendance, certificate generation.

### Epic 6: Automated Marketing & Communication 📋 Backlog
WhatsApp campaigns via Meta Cloud API, payment reminder automation, bulk email, durable notification queue, batch fill optimization.

### Epic 7: Owner Intelligence & Analytics 📋 Backlog
Branch health score (composite daily metric), counselor performance dashboard, daily 8AM bilingual WhatsApp brief, AI action recommendations.

### Epic 8: Unified Mobile App 📋 Backlog
One React Native app (Expo) with role-based views for Owner, Counselor, Educator, Student, and Parent. iOS and Android. Offline-read support.

---

## What's Built

| Screen | Description |
|--------|-------------|
| Login | Session-based authentication with role support |
| Owner Dashboard | Stats cards, branch health scores, AI briefing sidebar |
| CRM Kanban | 4-column pipeline (New → Contacted → Demo → Admitted), add and move leads |

---

## Design References

All screen designs are HTML prototypes. Design system uses Outfit typeface, Material Symbols icons, and a glass-panel component language.

| Screen | File |
|--------|------|
| Login / Signup | `designs/new_login.html` |
| Owner Dashboard | `designs/dashboard_owner.html` |
| CRM Kanban | `designs/crm_new.html` |
| Landing Page | `designs/new_landing.html` |
| Design System | `designs/newdesignsystem.md` |
| Moodboard | `designs/moodboard.md` |
| Design Specs | `designs/DESIGN_SPECIFICATIONS.md` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS v4 |
| Backend | Hono API |
| Database | Postgres (Supabase) with Row-Level Security |
| Auth | Supabase Auth |
| Payments | Razorpay — UPI, EMI, cards |
| WhatsApp | Meta WhatsApp Cloud API |
| Email | Resend (transactional) + Amazon SES (bulk) |
| Video CDN | Bunny.net |
| Mobile | React Native + Expo + EAS |

---

## What's Next

- **Student directory + enrollment** — student profiles, admission numbers, fee structures, and Razorpay payment integration
- **Full CRM** — global search, follow-up task reminders, counselor filters, lead activity timeline
- **Attendance** — QR-based and manual daily session attendance with parent notifications
- **Owner analytics** — branch health score cron, revenue trends, counselor performance metrics
- **WhatsApp automation** — payment reminders, enrollment confirmations, and daily owner brief via Meta Cloud API

---

## Critical Pre-Launch Actions

1. **Start Meta WhatsApp Business Manager registration — Day 1.** 3–5 week approval lead time. Every WhatsApp-dependent feature is blocked until approval.
2. **DPDPA legal opinion on data residency** — required before storing student data in production.
3. **Talk to 5 counselors at multi-branch coaching centers** before building Epic 3–4.
4. **Submit WhatsApp message templates for Meta pre-approval in Week 1** — 5+ templates needed (payment reminder, receipt, enrollment confirmation, demo reminder, daily brief).
