# Student Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Status:** Ready for Execution  
**Target:** SixBytes Student Resource Portal, Auth, PDF Viewer, Notice Board & SEO Resource Hub  

---

## Architecture Overview

```
app/
├── (auth)/
│   └── student-login/
│       └── page.tsx         <-- Obsidian Dark theme student login
├── dashboard/
│   └── page.tsx             <-- Full Student Resource Hub & In-app PDF Viewer
├── resources/
│   └── page.tsx             <-- Public SEO Study Guides & Formula Repository
├── api/
│   ├── login/
│   │   └── route.js         <-- JWT auth + bcrypt validation + cookie session
│   ├── logout/
│   │   └── route.js         <-- Clears auth cookie
│   ├── student/
│   │   └── me/
│   │       └── route.js     <-- Authenticated student profile
│   ├── material/
│   │   └── route.js         <-- Enhanced filtering by class, subject, category, search
│   └── announcements/
│       └── route.js         <-- Notices filtered by target class
models/
├── Student.js               <-- Enriched student schema
├── Material.js              <-- Categorized study material schema
└── Announcement.js          <-- Institute notices & batch alerts schema
```

---

## Tasks

### Task 1: Database Models & Schemas
- [ ] Upgrade [`models/User.ts`](file:///D:/sixbytes-website/models/User.ts) with indexed `email`, `class`, `stream`, and `role`.
- [ ] Upgrade [`models/Material.ts`](file:///D:/sixbytes-website/models/Material.ts) with `subject`, `category`, `isPublic`, and `downloadCount`.
- [ ] Create [`models/Notice.ts`](file:///D:/sixbytes-website/models/Notice.ts) for institute notices and alerts.

### Task 2: Backend APIs & JWT Session Management
- [ ] Upgrade [`app/api/auth/login/route.ts`](file:///D:/sixbytes-website/app/api/auth/login/route.ts) to support bcrypt verification and secure JWT cookie generation with JSON response fallback.
- [ ] Create [`app/api/auth/logout/route.ts`](file:///D:/sixbytes-website/app/api/auth/logout/route.ts) to clear session state.
- [ ] Create [`app/api/auth/me/route.ts`](file:///D:/sixbytes-website/app/api/auth/me/route.ts) to verify session and return current student profile.
- [ ] Upgrade [`app/api/faculty/materials/route.ts`](file:///D:/sixbytes-website/app/api/faculty/materials/route.ts) to support multi-parameter filtering (`class`, `subject`, `category`, `q`).
- [ ] Create [`app/api/student/notices/route.ts`](file:///D:/sixbytes-website/app/api/student/notices/route.ts) to return notices by class.

### Task 3: Redesign Student Login Page
- [ ] Rebuild [`app/student-login/page.tsx`](file:///D:/sixbytes-website/app/student-login/page.tsx) in the Obsidian Dark theme.
- [ ] Add particle field canvas, glassmorphic login card, loading states, error alerts, and demo session link.

### Task 4: Build Student Resource Dashboard
- [ ] Rebuild [`app/dashboard/page.tsx`](file:///D:/sixbytes-website/app/dashboard/page.tsx) into a complete Student Resource Hub:
  - Header: Student name, class badge, search bar, and logout.
  - Category Pills: *All*, *Class Notes*, *Formula Sheets*, *PYQs*, *Mock Tests*.
  - Subject Filters: *Mathematics*, *Physics*, *Chemistry*, *Biology*, *English*, *Defence GAT*.
  - Material Cards: Subject icon, title, category tag, download button, and in-modal PDF preview.
  - Notice Board: Real-time institute updates and batch timings.
  - Interactive PDF Viewer Modal: Preview notes directly inside the portal.

### Task 5: Build SEO Public Study Resources Page
- [ ] Create [`app/resources/page.tsx`](file:///D:/sixbytes-website/app/resources/page.tsx) to capture organic local student search traffic for Class 10/12 notes in Dehradun.
- [ ] Add `EducationalResource` structured JSON-LD schema.
- [ ] Link `/resources` in Navbar and Footer.

### Task 6: Build & Verification
- [ ] Execute `npm run build` and ensure 0 TypeScript and build errors across all routes.
- [ ] Test login, material filtering, and PDF viewer with browser subagent.
