# PRD — Product Requirements Document
## SixBytes Educational Institute Website Redesign

**Document Version:** 1.0  
**Date:** 2026-08-19  
**Author:** Freelance Developer  
**Founder:** Jaspal Singh Chauhan  
**Domain:** https://sixbytes.in

---

## Problem Statement

The current SixBytes Educational Institute website suffers from several critical issues:

1. **Inconsistent Design Language** — Each page (Home, About, Courses, Contact) embeds its own `<style>` block with duplicated CSS variables, utility classes, and animations. There is no shared design system.
2. **Poor Code Architecture** — All page code lives in massive single-file components (700+ lines). Shared utilities (ParticleField, Counter, useReveal, etc.) are duplicated across every page instead of being extracted into reusable components.
3. **Results Page Mismatch** — The `/results` page uses a completely different visual style (Tailwind utility classes, white background, basic cards) that clashes with the dark premium theme used on all other pages.
4. **Missing Footer** — There is no site-wide footer. No copyright, address, social links, or navigation repeated at the bottom of pages.
5. **Weak SEO** — No structured data (JSON-LD), no per-page meta descriptions, no Open Graph tags, no canonical URLs. The site targets "Premnagar, Dehradun" but lacks mentions of "Shyampur" which is a key local area.
6. **No Responsive Testing** — Mobile hamburger menu is functional but the mobile UX across all pages is inconsistent.
7. **Accessibility Gaps** — `cursor: none` on body removes the cursor globally (bad for accessibility), no ARIA labels, no semantic HTML landmarks.
8. **Duplicate Sitemap Config** — `next-sitemap.config.js` exports twice, which causes a silent override.
9. **Global CSS Conflict** — `globals.css` sets headings/paragraphs to dark colors (for light backgrounds), but the site uses a dark theme — causing silent style conflicts that are overridden by inline styles.
10. **Missing Founder Attribution** — The design references "Ishant Singh Bisht" but the actual founder is **Jaspal Singh Chauhan**.

---

## Target Users

| User Segment | Description |
|---|---|
| **Parents** (primary) | Parents of students in Class 9–12 searching for the best coaching institute in Premnagar / Shyampur / Dehradun |
| **Students** (secondary) | Class 9–12 students, NDA/RIMC/RMS aspirants looking for coaching |
| **Defence Aspirants** | NDA, Sainik School, RMS, RIMC candidates looking for specialised coaching |
| **Admin** (internal) | Institute admin managing students, materials, and results |

---

## Product Goals

1. **Design Excellence** — A premium, cohesive dark-themed website that wows visitors on first glance and establishes SixBytes as the most professional institute in the area.
2. **Local SEO Domination** — Rank for "best institute in Premnagar", "best coaching in Shyampur", "NDA coaching Dehradun", and related local keywords.
3. **Lead Generation** — Every page should funnel visitors toward booking a free demo class via WhatsApp or phone.
4. **Mobile-First Experience** — 70%+ of local traffic is mobile; the site must be flawless on phones.
5. **Maintainability** — Clean, modular component architecture that a junior developer or future AI session can understand and extend.

---

## Core Features

### Public Pages
1. **Home** — Hero with founder image, stats, courses overview, results showcase, testimonials, about section, final CTA
2. **About** — Detailed institute story, pillars, timeline, founder profile, SEO content
3. **Courses** — Detailed course cards (Class 9–10, 11–12, NDA/Defence), comparison table, FAQ
4. **Results** — Student achievement showcase with toppers gallery (dark theme, premium design)
5. **Contact** — Google Maps embed, phone, WhatsApp, Instagram, batch timings, directions

### Internal Pages
6. **Student Login** — Email/password authentication → student dashboard
7. **Dashboard** — View study materials filtered by class
8. **Admin Panel** — Manage students and upload materials (existing functionality)

### Site-Wide
9. **Navbar** — Sticky, responsive with mobile hamburger menu
10. **Footer** — Contact info, address, quick links, social media, copyright
11. **SEO Infrastructure** — JSON-LD, Open Graph, per-page metadata, structured data

---

## User Stories

1. As a **parent**, I want to see proof of results so I can trust SixBytes with my child's education.
2. As a **student**, I want to understand what courses are offered and how they differ.
3. As a **defence aspirant**, I want to know that SixBytes has specialised NDA coaching.
4. As a **visitor searching on Google**, I want SixBytes to appear for "best coaching in Premnagar" or "best institute in Shyampur".
5. As a **mobile user**, I want the website to load fast and look great on my phone.
6. As a **parent**, I want to quickly contact the institute via WhatsApp or phone.
7. As a **student**, I want to log in and access study materials.
8. As the **admin**, I want to manage students and upload materials.

---

## Functional Requirements

### FR-01: Shared Design System
- All CSS variables, animations, utility classes, and component styles must be defined in shared CSS files (not inline `<style>` blocks per page).

### FR-02: Component Library
- Extract reusable components: Navbar, Footer, ParticleField, Counter, SectionHeader, GlassCard, CTAButton, RevealWrapper, etc.

### FR-03: Results Page Redesign
- Must match the dark premium theme of all other pages.
- Show toppers with photos, names, grades, scores, and descriptions.

### FR-04: Footer Component
- Appears on all pages.
- Contains: address (Premnagar + Shyampur references), phone, WhatsApp link, Instagram link, quick links to all pages, copyright with founder name.

### FR-05: SEO Implementation
- JSON-LD structured data (LocalBusiness, EducationalOrganization) on every page.
- Per-page meta titles and descriptions targeting local keywords.
- Open Graph and Twitter Card meta tags.
- Keywords targeting: Premnagar, Shyampur, Dehradun, best coaching, NDA coaching, Sainik School coaching.

### FR-06: Founder Attribution
- Replace "Ishant Singh Bisht" with "Jaspal Singh Chauhan" as the founder name throughout.

### FR-07: Preserve All Existing Routes & Functionality
- All existing routes (/about, /courses, /results, /contact, /student-login, /dashboard, /admin, /api/*) must continue to work identically.
- All existing links (WhatsApp, Instagram, phone, Google Maps) must remain unchanged.

### FR-08: Accessibility
- Remove `cursor: none` from body (keep custom cursor as enhancement, not replacement).
- Add proper ARIA labels and semantic HTML.
- Ensure keyboard navigation works.

---

## Non-Functional Requirements

- **Performance**: Lighthouse performance score ≥ 85
- **Mobile**: Fully responsive, tested at 375px, 768px, and 1440px
- **Browser Support**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Load Time**: First Contentful Paint < 2s on 3G
- **Code Quality**: No duplicated component code across pages

---

## MVP Scope

**In Scope:**
- Redesign all public pages (Home, About, Courses, Results, Contact) with cohesive dark premium theme
- Create shared design system and component library
- Add Footer component
- Implement comprehensive SEO (JSON-LD, meta tags, OG tags)
- Fix Results page to match dark theme
- Fix globals.css conflicts
- Update founder name to Jaspal Singh Chauhan
- Fix sitemap config duplication

**Out of Scope (Phase 2):**
- Admin panel redesign
- Student dashboard redesign
- Student login page redesign
- Adding new features (blog, enrollment forms, payment integration)
- Backend API changes
- Database schema changes

---

## Constraints

1. Must use the existing Next.js 16 + Tailwind CSS 4 + TypeScript stack
2. Must not break any existing API routes or backend functionality
3. Must not require database migrations
4. The site domain is https://sixbytes.in
5. Phone: +91 75368 39760
6. Instagram: @sixbytes
7. Location: Opp. Lane No. 3, Sai Vihar, Shyampur, Premnagar, Dehradun
8. Google Maps embed URL must remain the same

---

## Success Criteria

1. All pages share a cohesive visual design — no page looks like it belongs to a different website
2. Zero duplicated utility/component code across page files
3. All pages have unique, SEO-optimized meta tags targeting local keywords
4. JSON-LD structured data present and valid (test with Google Rich Results)
5. Footer present on all pages
6. Results page matches the dark premium theme
7. Mobile hamburger menu works correctly with smooth animations
8. Founder name "Jaspal Singh Chauhan" appears correctly throughout

---

## Acceptance Criteria

- [ ] Home page loads in under 2s and displays founder image, stats, courses, testimonials
- [ ] About page shows institute story, pillars, timeline with correct founder name
- [ ] Courses page displays 3 course cards with comparison table and FAQ
- [ ] Results page shows toppers in dark premium theme (not white Tailwind cards)
- [ ] Contact page shows map, phone, WhatsApp, Instagram, batch timings
- [ ] Footer appears on every page with address, phone, social links
- [ ] All existing navigation links work correctly
- [ ] JSON-LD validates at https://validator.schema.org
- [ ] Lighthouse SEO score ≥ 90
- [ ] No `<style>` blocks inside page components — all styles in shared CSS
- [ ] All shared components are properly extracted and imported
