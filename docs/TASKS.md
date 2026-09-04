# TASKS.md — Implementation Plan & Progress
## SixBytes Website Redesign

**Last Updated:** 2026-08-19  
**Status:** ALL PHASES COMPLETE ✅

---

## Phase 1 — Foundation & Design System

```
[x] 1.1  Create shared design system in globals.css
         - Defined all CSS custom properties (colors, spacing, typography)
         - Defined all reusable animations (reveal, shimmer, float, glow, spin, slideUp, marquee)
         - Defined all utility classes (glass-card, btn-orange, btn-outline, section-label, orange-rule)
         - Removed conflicting light-theme styles from globals.css
         Status: Verified in app/globals.css

[x] 1.2  Update root layout.tsx with proper metadata & structure
         - Added Google Fonts (Playfair Display, Cormorant Garamond, DM Sans)
         - Added JSON-LD EducationalOrganization structured data
         - Integrated Navbar and Footer site-wide
         - Configured viewport, canonical tags, and Open Graph metadata
         Status: Verified in app/layout.tsx

[x] 1.3  Fix next-sitemap.config.js duplicate export
         - Clean single export with proper exclusion patterns (/admin, /dashboard, /student-login, /api)
         Status: Verified in next-sitemap.config.js & public/robots.txt
```

---

## Phase 2 — Component Library

```
[x] 2.1  Extract ParticleField component
         - Canvas particle field with connection lines and auto-mobile throttling
         Status: Verified in app/components/ui/particle-field.tsx

[x] 2.2  Extract Counter component
         - IntersectionObserver scroll-triggered count-up with ease-out cubic
         Status: Verified in app/components/ui/counter.tsx

[x] 2.3  Create RevealWrapper component
         - IntersectionObserver scroll reveal wrapper with configurable delay
         Status: Verified in app/components/ui/reveal-wrapper.tsx

[x] 2.4  Create SectionHeader component
         - Standardized section-label + orange-rule + Playfair Display heading + subtitle
         Status: Verified in app/components/ui/section-header.tsx

[x] 2.5  Create GlassCard component
         - Frosted glass container with responsive padding and hover glow
         Status: Verified in app/components/ui/glass-card.tsx

[x] 2.6  Create CTAButton component
         - Filled and outline variants supporting internal Link and external anchors
         Status: Verified in app/components/ui/cta-button.tsx

[x] 2.7  Extract ShimmerLine, TagPill, OrbitRings, Typewriter, FAQItem
         - Created standalone UI components in app/components/ui/
         Status: Verified in app/components/ui/

[x] 2.8  Create JSON-LD component
         - Structured data injection helper for LocalBusiness and EducationalOrganization
         Status: Verified in app/components/seo/json-ld.tsx
```

---

## Phase 3 — Navbar & Footer Redesign

```
[x] 3.1  Redesign Navbar
         - Glassmorphism backdrop blur on scroll, active route indicator, mobile drawer
         Status: Verified in app/components/navbar.tsx

[x] 3.2  Create Footer component
         - Address (Sai Vihar, Shyampur, Premnagar), programs list, quick links, founder attribution
         Status: Verified in app/components/footer.tsx

[x] 3.3  Integrate Navbar + Footer into layout.tsx
         - Present site-wide across all pages
         Status: Verified in app/layout.tsx
```

---

## Phase 4 — Page Redesigns

```
[x] 4.1  Redesign Home page (page.tsx)
         - Hero with particle canvas, stats counter, courses cards, toppers highlight, founder spotlight (Jaspal Singh Chauhan), testimonials, local SEO section, and final CTA
         Status: Verified in app/page.tsx

[x] 4.2  Redesign About page
         - Who we are, 6 pillars of excellence, journey timeline, founder statement, local SEO
         Status: Verified in app/about/page.tsx

[x] 4.3  Redesign Courses page
         - Detailed course cards (Class 9-10, Class 11-12 Science, NDA/Defence), comparison table, accessible FAQ accordion
         Status: Verified in app/courses/page.tsx

[x] 4.4  COMPLETE REDESIGN: Results page
         - Dark premium theme matching site-wide aesthetic, 4 topper cards with badges, score breakdown, success formula
         Status: Verified in app/results/page.tsx

[x] 4.5  Redesign Contact page
         - Campus details, phone numbers, WhatsApp, batch timings, interactive Google Maps embed, LocalBusiness schema
         Status: Verified in app/contact/page.tsx
```

---

## Phase 5 — SEO Optimization

```
[x] 5.1  Add per-page metadata exports
         - All 5 pages have unique, keyword-rich titles and descriptions
         Status: Verified in all page.tsx files

[x] 5.2  Add JSON-LD to all pages
         - EducationalOrganization in layout.tsx, LocalBusiness in contact/page.tsx
         Status: Verified

[x] 5.3  Fix robots.txt and sitemap config
         - Cleaned up disallow directives and single sitemap reference
         Status: Verified in public/robots.txt and next-sitemap.config.js

[x] 5.4  Add SEO-rich content with Shyampur mentions
         - "Shyampur" and "Premnagar" integrated naturally across headers, footers, and copy
         Status: Verified
```

---

## Phase 6 — Polish & QA

```
[x] 6.1  Mobile responsiveness audit
         - Tested at 390px viewport width: hamburger menu toggle and layouts verified
         Status: Verified via browser subagent

[x] 6.2  Accessibility audit
         - Removed global cursor: none, added focus-visible outlines, semantic landmarks
         Status: Verified

[x] 6.3  Performance optimization
         - Particle canvas throttling on mobile, lightweight CSS animations, lazy iframe
         Status: Verified

[x] 6.4  Final build test
         - Next.js 16 production build (`npm run build`) completed with 0 errors across 19 routes
         Status: Verified with exit code 0
```

---

## Phase 7 — NCERT Curriculum Expansion & Resources Engine

```
[x] 7.1  Expand NCERT Class 10 Science Coverage
         - Seeded missing chapters: Chemical Reactions & Equations, Acids Bases & Salts, Metals & Non-Metals, Life Processes, Control & Coordination, Our Environment
         - Detailed formula sheets, concepts, reaction mechanisms, and 5-mark board Q&As
         Status: Verified in scripts/seed-ncert-science.mjs

[x] 7.2  Expand NCERT Class 10 Mathematics Coverage
         - Complete curriculum coverage: Real Numbers, Polynomials, Linear Equations, Quadratic Equations, AP, Triangles, Coordinate Geometry, Trigonometry, Heights & Distances, Circles, Surface Areas & Volumes, Statistics, Probability
         - High-yield theorem proofs, step-by-step NCERT exercise solutions, board exam traps
         Status: Verified in scripts/seed-ncert-maths.mjs

[x] 7.3  Resources Metadata Normalization & Filtering
         - Standardized resourceType (topic_guide / question_bank), targetClass, and board
         - Added intelligent subject filtering supporting "Computer Science" / "Computer" aliases and broad "Science" grouping
         - Live verified across 42 published resources on sixbytes.in
         Status: Verified on production (42 resources active)
```

---

## Summary

| Phase | Tasks | Status |
|---|---|---|
| Phase 1 — Foundation | 1.1, 1.2, 1.3 | **COMPLETE ✅** |
| Phase 2 — Components | 2.1–2.8 | **COMPLETE ✅** |
| Phase 3 — Nav & Footer | 3.1–3.3 | **COMPLETE ✅** |
| Phase 4 — Page Redesigns | 4.1–4.5 | **COMPLETE ✅** |
| Phase 5 — SEO | 5.1–5.4 | **COMPLETE ✅** |
| Phase 6 — Polish & QA | 6.1–6.4 | **COMPLETE ✅** |
| Phase 7 — NCERT Curriculum Engine | 7.1–7.3 | **COMPLETE ✅** |
| **Total Tasks** | **27 / 27** | **100% COMPLETE** |

