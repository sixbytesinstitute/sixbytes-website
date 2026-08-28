# 3-Role Backend System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use TDD where applicable. Commit after each task.

**Spec:** [`docs/superpowers/specs/2026-08-28-backend-3-role-design.md`](file:///D:/sixbytes-website/docs/superpowers/specs/2026-08-28-backend-3-role-design.md)  
**Status:** Ready for Execution

---

## Global Constraints

- All files TypeScript (`.ts` / `.tsx`) unless wrapping an existing `.js` model
- Obsidian Dark theme (`bg-[#0a0c0e]`, amber/orange accents) for all new pages
- Google Drive links for file storage — no binary uploads to MongoDB
- JWT via `jsonwebtoken` in httpOnly cookies — never localStorage
- All API responses: `{ success: boolean, data?: ..., error?: string }`
- Reuse existing UI components from `app/components/ui/` (ParticleField, OrbitRings, PremiumIcon, TagPill, ShimmerLine, SectionHeader)
- Next.js 16.2.1 with Turbopack — read `node_modules/next/dist/docs/` before using new APIs

---

## File Map

### New Files

```
lib/
├── auth.ts                          # JWT sign/verify helpers, cookie config
├── middleware-auth.ts               # withAuth() wrapper for API routes
├── gdrive.ts                       # Google Drive URL parser (extract fileId, build embed/download URLs)
├── seed-admins.ts                   # Script to seed 2 super-admin accounts

models/
├── User.ts                          # Unified user model (admin/faculty/student)
├── Assignment.ts                    # Assignment schema
├── Notice.ts                        # Notice schema
├── Resource.ts                      # Public SEO resource schema
├── Material.ts                      # ← UPGRADE existing Material.js → .ts

app/
├── login/page.tsx                   # Unified login page (replaces student-login + admin login)
├── settings/page.tsx                # Change password page (all roles)
├── middleware.ts                     # Next.js edge middleware for route protection
│
├── admin/
│   ├── layout.tsx                   # Admin layout with sidebar nav
│   ├── dashboard/page.tsx           # ← REWRITE existing admin dashboard
│   ├── users/page.tsx               # Onboard & manage students/faculty
│   └── resources/page.tsx           # Create/edit SEO resource articles
│
├── faculty/
│   ├── layout.tsx                   # Faculty layout with sidebar nav
│   ├── dashboard/page.tsx           # Faculty home
│   ├── assignments/page.tsx         # Create & list assignments
│   ├── materials/page.tsx           # Upload materials (Google Drive links)
│   ├── notices/page.tsx             # Post notices
│   └── students/page.tsx            # View student list
│
├── dashboard/
│   └── page.tsx                     # ← REWRITE student dashboard
│
├── resources/
│   ├── page.tsx                     # Public resource listing
│   └── [slug]/page.tsx              # Individual SEO article
│
├── api/
│   ├── auth/
│   │   ├── login/route.ts           # Unified login (replaces api/login + api/admin/login)
│   │   ├── logout/route.ts          # Clear cookie
│   │   ├── me/route.ts              # Current user profile
│   │   └── change-password/route.ts # Self password change
│   │
│   ├── admin/
│   │   ├── users/route.ts           # POST create user, GET list users
│   │   ├── users/[id]/route.ts      # GET/PUT/DELETE single user
│   │   ├── resources/route.ts       # POST create, GET list resources
│   │   └── resources/[id]/route.ts  # PUT/DELETE single resource
│   │
│   ├── faculty/
│   │   ├── assignments/route.ts     # POST create, GET list (own classes)
│   │   ├── materials/route.ts       # POST create, GET list (own classes)
│   │   ├── notices/route.ts         # POST create, GET list (own classes)
│   │   └── students/route.ts        # GET students in own classes
│   │
│   ├── student/
│   │   ├── assignments/route.ts     # GET assignments for own class
│   │   ├── materials/route.ts       # GET materials for own class
│   │   └── notices/route.ts         # GET notices for own class
│   │
│   └── resources/
│       ├── route.ts                 # GET published resources (public)
│       └── [slug]/route.ts          # GET single resource by slug (public)
│
├── components/
│   ├── cookie-consent.tsx           # GDPR cookie consent banner
│   ├── gdrive-viewer.tsx            # Google Drive PDF embed + download button
│   ├── dashboard-sidebar.tsx        # Shared sidebar for admin/faculty dashboards
│   └── seo/
│       └── json-ld.tsx              # ← EXISTS, may need updates
```

### Files to Delete (after migration)

```
app/admin/page.jsx                   # Old admin login (replaced by /login)
app/student-login/page.tsx           # Old student login (replaced by /login)
app/api/login/route.js               # Old student login API (replaced by /api/auth/login)
app/api/admin/login/route.js         # Old admin login API (replaced by /api/auth/login)
models/Student.js                    # Old model (replaced by User.ts)
```

### Files to Modify

```
app/layout.tsx                       # Add GA4 script, cookie consent component
app/components/navbar.tsx            # Add "Resources" and "Login" links
app/components/footer.tsx            # Add "Resources" link
next-sitemap.config.js               # Add /resources/[slug] dynamic paths
package.json                         # Add jsonwebtoken dependency
```

---

## Tasks

### Task 1: Install Dependencies & Core Auth Library

**Goal:** Install `jsonwebtoken`, create JWT helpers, Google Drive URL parser, and the `withAuth` API wrapper.

**Steps:**
1. Run `npm install jsonwebtoken @types/jsonwebtoken`
2. Create `lib/auth.ts`:
   - `signToken(payload: { userId: string, role: string, email: string, class?: string })` → returns signed JWT (secret from `process.env.JWT_SECRET`, 7d expiry)
   - `verifyToken(token: string)` → returns decoded payload or null
   - `COOKIE_CONFIG` object: `{ name: "sb_session", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60 }`
3. Create `lib/middleware-auth.ts`:
   - `withAuth(handler, allowedRoles?: string[])` — reads cookie from request, verifies JWT, injects `user` into handler context. Returns 401 if missing/invalid, 403 if role not in allowedRoles.
4. Create `lib/gdrive.ts`:
   - `extractDriveFileId(url: string): string | null` — extracts file ID from any Google Drive URL format (`/file/d/ID/`, `?id=ID`, `/open?id=ID`)
   - `getDriveEmbedUrl(fileId: string): string` → `https://drive.google.com/file/d/${fileId}/preview`
   - `getDriveDownloadUrl(fileId: string): string` → `https://drive.google.com/uc?export=download&id=${fileId}`
5. Run `npm run build` to verify no TypeScript errors
6. Commit: `feat(auth): add JWT helpers, Drive URL parser, and auth middleware`

**Docs to check:** Read Next.js cookie handling docs in `node_modules/next/dist/docs/` for the cookies() API.

---

### Task 2: Database Models

**Goal:** Create all 5 Mongoose models.

**Steps:**
1. Create `models/User.ts` with the schema from the spec:
   - Fields: name, email (unique, lowercase, indexed), phone, password, role (enum admin/faculty/student, indexed), class (enum, indexed), stream (enum), subjects (string[]), assignedClasses (string[]), mustChangePassword (default true), isActive (default true), timestamps
   - Pre-save hook: set `updatedAt` on every save
   - **Do NOT delete `models/Student.js` yet** — we'll migrate references later
2. Create `models/Assignment.ts`:
   - Fields: title, description, targetClass (enum + indexed), subject (indexed), dueDate, fileUrl, fileName, createdBy (ref User), createdAt
3. Upgrade `models/Material.js` → create `models/Material.ts`:
   - Keep backward compatibility with existing data
   - Add: description, fileName, subject (indexed), category (enum + indexed), createdBy (ref User)
   - Remove: embedded `isPublic`, `downloadCount`, `fileSize` (those belong to Resource model now)
4. Create `models/Notice.ts`:
   - Fields: title, content, targetClass (enum + indexed), priority (enum), pinned, createdBy (ref User), createdAt, expiresAt
5. Create `models/Resource.ts`:
   - Fields: slug (unique, indexed), title, metaDescription, subject (indexed), targetClass (enum), chapter, content (String, required — HTML), keywords (string[]), published (indexed), viewCount, createdBy (ref User), timestamps
6. Run `npm run build`
7. Commit: `feat(models): add User, Assignment, Notice, Resource models and upgrade Material`

---

### Task 3: Auth API Routes & Edge Middleware

**Goal:** Unified login, logout, /me, change-password endpoints + Next.js middleware for route protection.

**Steps:**
1. Create `app/api/auth/login/route.ts`:
   - POST: accept `{ email, password }`, find User by email (case-insensitive), bcrypt.compare, check `isActive`, sign JWT, set httpOnly cookie
   - Response: `{ success: true, user: { id, name, email, role, class, mustChangePassword } }`
   - If `mustChangePassword` is true, frontend should redirect to `/settings`
2. Create `app/api/auth/logout/route.ts`:
   - POST: clear the `sb_session` cookie by setting maxAge=0
3. Create `app/api/auth/me/route.ts`:
   - GET: protected (any role), read cookie → verify → return user profile from DB (exclude password)
4. Create `app/api/auth/change-password/route.ts`:
   - POST: protected (any role), accept `{ currentPassword, newPassword }`
   - Verify current password, hash new password, update user, set `mustChangePassword = false`
5. Create `app/middleware.ts` (Next.js edge middleware):
   - Protect routes: `/admin/*` requires role=admin, `/faculty/*` requires role=faculty, `/dashboard` requires role=student
   - Redirect unauthenticated users to `/login`
   - Redirect authenticated users away from `/login` to their correct dashboard
   - **Read Next.js middleware docs** in `node_modules/next/dist/docs/` first — middleware API may differ from training data
6. Create `lib/seed-admins.ts`:
   - Script to create 2 super-admin accounts (emails/passwords from env vars `ADMIN1_EMAIL`, `ADMIN1_PASSWORD`, `ADMIN2_EMAIL`, `ADMIN2_PASSWORD`)
   - Add npm script `"seed"` in package.json: `"npx tsx lib/seed-admins.ts"`
7. Run `npm run build`
8. Commit: `feat(auth): unified login/logout/me/change-password APIs and edge middleware`

---

### Task 4: Admin API Routes — User Management & Resources

**Goal:** Admin can create/list/update/delete users and manage SEO resources.

**Steps:**
1. Create `app/api/admin/users/route.ts`:
   - POST (admin only): Create student or faculty
     - Accept: `{ name, email, phone, role, class?, stream?, subjects?, assignedClasses? }`
     - Auto-generate password: `SixBytes@` + last 4 digits of phone
     - Hash with bcrypt, set `mustChangePassword: true`
     - Return the generated plaintext password ONCE in the response
   - GET (admin only): List all users, filterable by `?role=`, `?class=`, `?search=`
     - Exclude password field, sort by createdAt desc
2. Create `app/api/admin/users/[id]/route.ts`:
   - GET (admin only): Single user details
   - PUT (admin only): Update user fields (name, phone, class, subjects, assignedClasses, isActive)
   - DELETE (admin only): Soft-delete by setting `isActive: false`
3. Create `app/api/admin/resources/route.ts`:
   - POST (admin only): Create SEO resource article
     - Accept: `{ title, slug, metaDescription, subject, targetClass, chapter, content, keywords, published }`
     - Auto-generate slug from title if not provided
   - GET (admin only): List all resources (including unpublished)
4. Create `app/api/admin/resources/[id]/route.ts`:
   - PUT (admin only): Update resource
   - DELETE (admin only): Delete resource
5. Run `npm run build`
6. Commit: `feat(admin): user management and resource CRUD APIs`

---

### Task 5: Faculty API Routes

**Goal:** Faculty can create assignments, upload materials, post notices for their assigned classes, and view their students.

**Steps:**
1. Create `app/api/faculty/assignments/route.ts`:
   - POST (faculty only): Create assignment
     - Accept: `{ title, description, targetClass, subject, dueDate, fileUrl?, fileName? }`
     - Validate that `targetClass` is in the faculty's `assignedClasses`
     - Validate `fileUrl` with `extractDriveFileId()` if provided
   - GET (faculty only): List assignments created by this faculty
2. Create `app/api/faculty/materials/route.ts`:
   - POST (faculty only): Create material
     - Accept: `{ title, description, fileUrl, fileName, class, subject, category }`
     - Validate class is in faculty's `assignedClasses`
     - Validate `fileUrl` with `extractDriveFileId()`
   - GET (faculty only): List materials for faculty's assigned classes
3. Create `app/api/faculty/notices/route.ts`:
   - POST (faculty only): Create notice
     - Accept: `{ title, content, targetClass, priority }`
     - Validate `targetClass` is in faculty's `assignedClasses` (or "All" only if admin)
   - GET (faculty only): List notices created by this faculty
4. Create `app/api/faculty/students/route.ts`:
   - GET (faculty only): List students where student's class is in faculty's `assignedClasses`
     - Exclude password, sortable by name
5. Run `npm run build`
6. Commit: `feat(faculty): assignment, material, notice, and student list APIs`

---

### Task 6: Student API Routes

**Goal:** Students can view their assignments, materials, and notices filtered by their class.

**Steps:**
1. Create `app/api/student/assignments/route.ts`:
   - GET (student only): Assignments where `targetClass` matches student's class OR "All", sorted by dueDate desc
2. Create `app/api/student/materials/route.ts`:
   - GET (student only): Materials where `class` matches student's class OR "All"
   - Filterable by `?subject=`, `?category=`, `?search=`
3. Create `app/api/student/notices/route.ts`:
   - GET (student only): Notices where `targetClass` matches student's class OR "All"
   - Filter out expired notices, pinned first, then by createdAt desc
4. Create `app/api/resources/route.ts`:
   - GET (public): List published resources, filterable by `?subject=`, `?class=`, `?search=`
5. Create `app/api/resources/[slug]/route.ts`:
   - GET (public): Single resource by slug, increment `viewCount`
6. Run `npm run build`
7. Commit: `feat(student): assignment, material, notice APIs and public resource endpoints`

---

### Task 7: Unified Login Page & Settings Page

**Goal:** Single premium login page for all roles, and a shared password-change settings page.

**Steps:**
1. Create `app/login/page.tsx`:
   - Reuse the Obsidian Dark design from current `student-login/page.tsx`
   - Same particles, orbit rings, glassmorphic card
   - Login form: email + password fields
   - On success: check `user.mustChangePassword` → redirect to `/settings` if true
   - Otherwise redirect based on role: admin→`/admin/dashboard`, faculty→`/faculty/dashboard`, student→`/dashboard`
   - Remove role selector — backend auto-detects role from email
2. Create `app/settings/page.tsx`:
   - Protected page (any authenticated role)
   - Form: current password, new password, confirm new password
   - Calls `POST /api/auth/change-password`
   - On success: redirect to appropriate dashboard
3. Update `app/components/navbar.tsx`:
   - Add "Resources" link pointing to `/resources`
   - Add "Login" / "Portal" button (conditionally show based on auth state via /api/auth/me)
4. Delete old files:
   - `app/student-login/page.tsx`
   - `app/admin/page.jsx`
   - `app/api/login/route.js`
   - `app/api/admin/login/route.js`
5. Run `npm run build`
6. Commit: `feat(ui): unified login page and settings page, retire old login routes`

---

### Task 8: Admin & Faculty Dashboard Pages

**Goal:** Build the admin and faculty dashboard UIs.

**Steps:**
1. Create `app/components/dashboard-sidebar.tsx`:
   - Shared sidebar component: logo, nav links (role-dependent), logout button
   - Admin links: Dashboard, Users, Resources
   - Faculty links: Dashboard, Assignments, Materials, Notices, Students
   - Obsidian Dark theme with amber accent on active link
2. Create `app/admin/layout.tsx`:
   - Wraps admin pages with sidebar + main content area
   - Fetch `/api/auth/me` to verify admin role
3. Rewrite `app/admin/dashboard/page.tsx`:
   - Stats cards: total students, total faculty, total materials, total resources
   - Recent activity feed (latest 5 users created, latest 5 notices)
4. Create `app/admin/users/page.tsx`:
   - Table listing all users with role/class badges
   - "Onboard User" modal form: name, email, phone, role selector, class (if student), subjects + assignedClasses (if faculty)
   - Shows generated password in a success modal after creation
   - Edit and deactivate actions
5. Create `app/admin/resources/page.tsx`:
   - List of all SEO resource articles (published/draft status)
   - Create/Edit form: title, slug, meta description, subject, class, chapter, content (textarea with HTML), keywords
   - Publish/unpublish toggle
6. Create `app/faculty/layout.tsx`: sidebar + auth check for faculty role
7. Create `app/faculty/dashboard/page.tsx`:
   - Overview: my classes, assignments due this week, recent notices
8. Create `app/faculty/assignments/page.tsx`:
   - List + create form: title, description, class (from own assignedClasses), subject, due date, Google Drive link (optional)
   - Google Drive link validator: show preview iframe after pasting
9. Create `app/faculty/materials/page.tsx`:
   - List + create form: title, description, Google Drive link, class, subject, category dropdown
10. Create `app/faculty/notices/page.tsx`:
    - List + create form: title, content, class, priority
11. Create `app/faculty/students/page.tsx`:
    - Table of students in faculty's assigned classes, filterable by class
12. Create `app/components/gdrive-viewer.tsx`:
    - Props: `url: string` (raw Google Drive link)
    - Extracts fileId, renders iframe embed + download button
    - Fallback text if URL is invalid
13. Run `npm run build`
14. Commit: `feat(ui): admin and faculty dashboards with full CRUD interfaces`

---

### Task 9: Student Dashboard & Public Resources Pages

**Goal:** Upgrade student dashboard and build the public SEO resource pages.

**Steps:**
1. Rewrite `app/dashboard/page.tsx` (student dashboard):
   - Sidebar: profile info (name, class, stream), nav (Dashboard, Assignments, Materials, Notices, Settings), logout
   - Main: tabbed view — Assignments | Materials | Notices
   - **Assignments tab**: cards showing title, subject, due date, file preview (GDrive iframe) + download
   - **Materials tab**: filter by subject + category pills, material cards with GDrive viewer
   - **Notices tab**: notices feed, pinned at top, priority badges (urgent = red, exam_alert = amber)
   - Use existing UI components (TagPill, PremiumIcon, ShimmerLine)
2. Create `app/resources/page.tsx`:
   - Public (no auth): SEO-optimized listing of published resources
   - Filter by subject and class
   - Cards: title, subject badge, class badge, excerpt, "Read More" link
   - JSON-LD `ItemList` structured data
3. Create `app/resources/[slug]/page.tsx`:
   - Public: full article page
   - `generateMetadata()` for dynamic SEO title + description
   - JSON-LD `Article` + `EducationalOrganization` structured data
   - Render HTML content safely (sanitized)
   - CTA banner: "Join SixBytes — Enroll Now" with link to `/contact`
4. Create `app/components/cookie-consent.tsx`:
   - Banner at bottom: "We use cookies for analytics..." with Accept/Decline buttons
   - Stores consent in a `sb_cookie_consent` cookie
   - Only loads GA4 script after consent
5. Run `npm run build`
6. Commit: `feat(ui): student dashboard, public resources pages, cookie consent`

---

### Task 10: SEO & Analytics Integration + Cleanup

**Goal:** GA4, Search Console, social meta, sitemap, and final cleanup.

**Steps:**
1. Update `app/layout.tsx`:
   - Add `cookie-consent.tsx` component
   - Add GA4 `<Script>` tag (loads only when cookie consent given)
   - Add Google Search Console verification meta tag
2. Update `next-sitemap.config.js` (or create if needed):
   - Add dynamic `/resources/[slug]` paths by querying published resources
   - Ensure all public pages are included
3. Add Open Graph + Twitter Card meta to key pages:
   - Home (`app/page.tsx`): og:title, og:description, og:image
   - Resources listing and individual articles: dynamic meta via `generateMetadata()`
4. Verify `robots.txt` allows crawling of `/resources/*`
5. Delete legacy files no longer needed:
   - `models/Student.js` (replaced by User.ts)
   - `app/api/students/route.js` and `app/api/students/[ID]/route.js` (replaced by admin user APIs)
   - `app/api/upload/route.js` and `app/api/upload-material/route.js` (no longer needed — Google Drive)
   - `app/admin/upload/` directory
6. Run full `npm run build` — verify 0 errors
7. Commit: `feat(seo): GA4, Search Console, sitemap, social meta, cleanup legacy files`
8. Push to `origin/main`

---

## Dependency Changes

| Package | Action | Purpose |
|---|---|---|
| `jsonwebtoken` | Install | JWT sign/verify for session cookies |
| `@types/jsonwebtoken` | Install (dev) | TypeScript types |
| `cloudinary` | **Remove** | No longer needed (Google Drive for files) |
| `bcrypt` | Keep | Password hashing |
| `bcryptjs` | **Remove** | Duplicate of bcrypt |

---

## Environment Variables Needed

```env
# Existing
MONGO_URI=mongodb+srv://...

# New
JWT_SECRET=<random-64-char-string>
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
ADMIN1_EMAIL=jaspal@sixbytes.in
ADMIN1_PASSWORD=<strong-password>
ADMIN2_EMAIL=<second-admin-email>
ADMIN2_PASSWORD=<strong-password>
```
