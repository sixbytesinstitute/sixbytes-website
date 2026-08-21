# ARCHITECTURE.md — System Architecture
## SixBytes Educational Institute Website

**Last Updated:** 2026-08-19  
**Status:** PLANNED (pre-redesign)

---

## Overall System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     Client (Browser)                      │
│  ┌────────────────────────────────────────────────────┐   │
│  │          Next.js 16 (App Router, React 19)         │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │   │
│  │  │  Layout   │  │  Navbar  │  │     Footer       │ │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘ │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │              Page Components                  │  │   │
│  │  │  Home │ About │ Courses │ Results │ Contact  │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │            Internal Pages                     │  │   │
│  │  │  Student Login │ Dashboard │ Admin Panel      │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────┬────────────────────────────┘
                               │ API Routes
                               ▼
┌──────────────────────────────────────────────────────────┐
│                    Backend (Next.js API)                   │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐    │
│  │  /api/login │  │/api/students│  │/api/material     │    │
│  │             │  │/api/students│  │/api/upload       │    │
│  │             │  │  /[ID]     │  │/api/upload-material│   │
│  └──────┬──────┘  └─────┬──────┘  └────────┬─────────┘    │
│         └───────────────┼──────────────────┘               │
│                         ▼                                  │
│              ┌──────────────────┐                          │
│              │   MongoDB Atlas   │                          │
│              │   (via Mongoose)  │                          │
│              └──────────────────┘                          │
│                                                            │
│              ┌──────────────────┐                          │
│              │   Cloudinary CDN  │                          │
│              │   (file uploads)  │                          │
│              └──────────────────┘                          │
└──────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Current State (Pre-Redesign)

**Problems:**
- Each page (home, about, courses, contact) contains a massive 400-700 line `<style>` block with duplicated CSS variables, animations, and utility classes.
- Components like `ParticleField`, `Counter`, `useReveal`, `CursorFollower` are copy-pasted into each page file.
- The `/results` page uses Tailwind utility classes with a white background, completely mismatched from the dark theme.
- No footer component exists.

### Target Architecture (Post-Redesign)

```
app/
├── layout.tsx              ← Root layout with Navbar + Footer + SEO
├── globals.css             ← Complete design system (dark theme)
├── page.tsx                ← Home page (lean, imports shared components)
├── about/page.tsx          ← About page
├── courses/page.tsx        ← Courses page
├── results/page.tsx        ← Results page (redesigned to dark theme)
├── contact/page.tsx        ← Contact page
├── student-login/page.jsx  ← Student login (unchanged MVP)
├── dashboard/page.jsx      ← Student dashboard (unchanged MVP)
├── admin/                  ← Admin panel (unchanged MVP)
├── api/                    ← API routes (unchanged)
│   ├── login/route.js
│   ├── students/route.js
│   ├── students/[ID]/route.js
│   ├── material/route.js
│   ├── upload/route.js
│   ├── upload-material/route.js
│   └── admin/login/route.js
├── components/
│   ├── navbar.tsx          ← Redesigned navbar
│   ├── footer.tsx          ← NEW: site-wide footer
│   ├── ui/
│   │   ├── particle-field.tsx
│   │   ├── counter.tsx
│   │   ├── reveal-wrapper.tsx
│   │   ├── section-header.tsx
│   │   ├── glass-card.tsx
│   │   ├── cta-button.tsx
│   │   ├── tag-pill.tsx
│   │   ├── shimmer-line.tsx
│   │   ├── orbit-rings.tsx
│   │   ├── typewriter.tsx
│   │   └── faq-item.tsx
│   ├── sections/
│   │   ├── hero-section.tsx
│   │   ├── courses-section.tsx
│   │   ├── results-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── about-section.tsx
│   │   └── cta-section.tsx
│   └── seo/
│       ├── json-ld.tsx
│       └── og-meta.tsx
lib/
├── mongodb.js              ← MongoDB connection (unchanged)
├── cloudinary.js           ← Cloudinary config (unchanged)
└── mongoose.js             ← Mongoose config (unchanged)
models/
├── Student.js              ← Student model (unchanged)
└── Material.js             ← Material model (unchanged)
public/
├── logo.png
├── hero.jpg
├── topper[1-2].jpg
├── student[1-2].jpg
├── robots.txt
├── sitemap.xml
└── sitemap-0.xml
```

---

## Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--orange` | `#F97316` | Primary accent |
| `--orange-light` | `#FB923C` | Gradient endpoints |
| `--orange-dim` | `rgba(249,115,22,0.15)` | Subtle backgrounds |
| `--obsidian` | `#0a0c0e` | Primary background |
| `--navy` | `#0f1318` | Alternate section bg |
| `--navy-mid` | `#141a1f` | Card surfaces |
| `--cream` | `#F7F3EC` | Primary text |
| `--text-muted` | `rgba(247,243,236,0.55)` | Secondary text |

### Typography
| Font | Usage |
|---|---|
| Playfair Display (800) | Headings, display text |
| Cormorant Garamond (300-600) | Serif accents, taglines, stats |
| DM Sans (300-500) | Body text, labels, buttons |

### Animation System
| Name | Usage |
|---|---|
| `reveal` | Scroll-triggered fade-up entrance |
| `shimmer` | Gradient line animation |
| `floatY` | Floating badge effect |
| `glowPulse` | Pulsing glow blobs |
| `spin` | Orbit ring rotation |
| `slideUp` | Hero text stagger entrance |

---

## Backend Architecture

### Database (MongoDB Atlas)
Two collections:
- **students** — name, email, password (bcrypt hashed), class, attendance[], results[], materials[]
- **materials** — title, fileUrl, class, createdAt

### API Routes

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/login` | Student authentication |
| GET | `/api/students` | List all students |
| POST | `/api/students` | Create student |
| GET | `/api/students/[ID]` | Get student by ID |
| PUT | `/api/students/[ID]` | Update student |
| DELETE | `/api/students/[ID]` | Delete student |
| GET | `/api/material` | List all materials |
| POST | `/api/upload-material` | Upload material file |
| POST | `/api/upload` | Upload file to Cloudinary |
| POST | `/api/admin/login` | Admin authentication |

### External Services
- **Cloudinary** — File/PDF storage for study materials
- **MongoDB Atlas** — Primary database
- **Google Maps Embed** — Location display on contact page

---

## SEO Architecture

### Per-Page Metadata (via Next.js `metadata` export)
Each page exports its own `metadata` object with:
- `title` — Unique, keyword-rich title
- `description` — 150-160 char description with local keywords
- `openGraph` — OG title, description, image, url
- `twitter` — Twitter card meta
- `alternates.canonical` — Canonical URL

### JSON-LD Structured Data
- **EducationalOrganization** — On home page
- **LocalBusiness** — On contact page
- **Course** — On courses page
- **BreadcrumbList** — On all pages

### Target Keywords
| Priority | Keywords |
|---|---|
| High | best coaching institute in Premnagar, best institute in Shyampur |
| High | NDA coaching Dehradun, Sainik School coaching Dehradun |
| Medium | Class 9 10 coaching Premnagar, Class 11 12 coaching Dehradun |
| Medium | RIMC coaching, RMS coaching Uttarakhand |
| Low | best tuition in Dehradun, defence coaching Dehradun |

---

## Deployment Architecture

- **Hosting**: Vercel (Next.js default)
- **Domain**: sixbytes.in (custom domain on Vercel)
- **Database**: MongoDB Atlas (cloud)
- **File Storage**: Cloudinary CDN
- **Sitemap**: Auto-generated via `next-sitemap`

---

## Security Considerations

1. Admin and student passwords hashed with bcrypt
2. API routes should validate input (currently minimal validation)
3. Sensitive pages (/admin, /dashboard, /student-login) excluded from sitemap
4. Robots.txt blocks crawling of admin/dashboard/login pages
5. Environment variables for all secrets (MONGO_URI, CLOUDINARY_*, ADMIN_PASSWORD)

---

## Important Technical Constraints

1. Next.js 16 with App Router — follow the docs at `node_modules/next/dist/docs/`
2. React 19 — use latest hooks and patterns
3. Tailwind CSS 4 — imported via `@import "tailwindcss"` in globals.css
4. TypeScript for page components, JavaScript for API routes and models
5. No additional UI libraries (no shadcn, no MUI) — custom components only
6. framer-motion is available but not currently used meaningfully
