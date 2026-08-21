# DECISIONS.md — Architecture & Engineering Decisions

**Project:** SixBytes Educational Institute Website Redesign  
**Started:** 2026-08-19

---

## ADR-001 — Keep Existing Dark Theme, Don't Switch to Light

**Date:** 2026-08-19

### Decision
Retain the dark obsidian/orange theme as the primary design language for all public pages.

### Context
The original Canva design mockup uses a dark theme with orange accents. Four out of five existing pages (Home, About, Courses, Contact) already implement this dark theme. Only the Results page uses a white/light layout.

### Alternatives
- **Full light theme redesign** — Scrap the dark theme, go with a clean white/orange design
- **Hybrid** — Keep some pages dark, some light

### Reasoning
1. Dark themes convey premium quality — appropriate for an educational institute positioning itself as the best in the area.
2. 80% of the site already uses the dark theme — migrating to light would be more work.
3. The Canva mockup provided by the client uses a dark theme.
4. The dark theme with orange accents is visually distinctive in the local market.

### Consequences
- The Results page must be completely redesigned to match.
- The Student Login, Dashboard, and Admin pages will remain light-themed (out of MVP scope) — this is acceptable since they are internal-only pages.

### Status
**Accepted**

---

## ADR-002 — Create Shared Design System in globals.css Instead of Per-Page Style Blocks

**Date:** 2026-08-19

### Decision
Move all CSS custom properties, animations, and utility classes into `globals.css` and remove inline `<style>` blocks from all page components.

### Context
Currently, each page embeds 100-200 lines of CSS in `<style>` tags. This duplicates:
- CSS custom properties (--orange, --cream, --obsidian, etc.)
- Animation keyframes (reveal, shimmer, float, slideUp, spin, glowPulse)
- Utility classes (.display, .serif, .orange-text, .glass-card, .btn-orange, .reveal, etc.)

The same definitions exist in 4+ files, with slight variations (e.g., `.s-label` vs `.section-label`, `.g-card` vs `.glass-card`).

### Alternatives
- **CSS Modules** — Per-component CSS modules
- **Styled Components** — Runtime CSS-in-JS
- **Keep as-is** — Continue with inline `<style>` blocks

### Reasoning
1. A single source of truth eliminates class name drift and inconsistency.
2. `globals.css` already exists and is imported in the root layout — it's the natural home.
3. CSS Modules would fragment the design system across dozens of files.
4. Styled Components add runtime overhead and complexity.
5. Tailwind CSS 4 is already configured — CSS custom properties work perfectly alongside it.

### Consequences
- All pages will import from the same design system.
- Class names must be normalized (e.g., pick `.glass-card` or `.g-card`, not both).
- Page components become significantly shorter and easier to maintain.

### Status
**Accepted**

---

## ADR-003 — Extract Shared Components Instead of Duplicating

**Date:** 2026-08-19

### Decision
Extract all duplicated UI components into `app/components/ui/` and import them where needed.

### Context
The following components are duplicated across 2-4 page files:
- `ParticleField` — canvas-based particle animation (duplicated in 4 files)
- `Counter` — intersection observer + count-up animation (duplicated in 2 files)
- `useReveal` — scroll reveal hook (duplicated in 4 files)
- `CursorFollower` — custom cursor (in home only, but should be global or removed)
- `OrbitRings` — decorative spinning rings (duplicated in 3 files)
- `Typewriter` — typed text animation (about page only)
- `FaqItem` — accordion component (courses page only)

### Alternatives
- **Leave duplicated** — Each page owns its own components
- **Use a third-party component library** — shadcn/ui, Radix, etc.

### Reasoning
1. DRY principle — fixing a bug or adjusting animation parameters requires changing one file instead of four.
2. Third-party libraries add bundle size and learning curve for the client's future developer.
3. Custom components allow pixel-perfect control over the design.
4. The components are small enough that extraction is straightforward.

### Consequences
- Components must accept props for customization (e.g., ParticleField needs configurable particle count).
- Pages become lean composition layers that assemble shared components.
- A future developer only needs to understand `app/components/` to modify the UI.

### Status
**Accepted**

---

## ADR-004 — Add Shyampur as a Primary SEO Target Alongside Premnagar

**Date:** 2026-08-19

### Decision
Add "Shyampur" as a co-primary local keyword alongside "Premnagar" in all SEO-relevant text, meta tags, and structured data.

### Context
The client's address is: *Opp. Lane No. 3, Sai Vihar, Shyampur, Premnagar, Dehradun*. The current site only targets "Premnagar, Dehradun" in its SEO content. The client explicitly requested optimization for both Premnagar and Shyampur.

### Alternatives
- **Target only Premnagar** — Current approach, misses Shyampur search traffic
- **Target Dehradun broadly** — Wider reach but less competitive for local searches

### Reasoning
1. The institute is physically located in the Shyampur/Premnagar area — both are valid local identifiers.
2. "Shyampur" may have less competition than "Premnagar" for coaching-related searches.
3. Google's local SEO algorithm rewards natural mentions of nearby localities.
4. The address itself contains both names — using both is factually accurate.

### Consequences
- Meta titles/descriptions will mention both "Premnagar" and "Shyampur".
- Footer and SEO sections will reference both areas.
- JSON-LD address will include both identifiers.
- Copy must feel natural — not keyword-stuffed.

### Status
**Accepted**

---

## ADR-005 — Use Jaspal Singh Chauhan as Founder Name

**Date:** 2026-08-19

### Decision
All references to the institute founder will use the name "Jaspal Singh Chauhan".

### Context
The Canva design mockup displays "Ishant Singh Bisht" as the "Founder & Mentor" name. However, the client has explicitly stated that the actual founder is **Jaspal Singh Chauhan**. The current website's home page quote section references "Ishant Singh Bisht".

### Alternatives
- **Keep Ishant Singh Bisht** — Match the Canva design
- **Show both** — List as co-founders

### Reasoning
The client explicitly provided the correct founder name. The Canva mockup appears to contain an error or may reference a different person (perhaps a mentor/teacher at the institute, not the founder).

### Consequences
- The quote on the home page will be attributed to Jaspal Singh Chauhan.
- The About page founder section will use Jaspal Singh Chauhan.
- The footer copyright/attribution will reference Jaspal Singh Chauhan.
- The person in `founder.png` may not be Jaspal Singh Chauhan — this should be verified with the client.

### Status
**Accepted**

---

## ADR-006 — Don't Modify Backend API Routes or Database Schema in MVP

**Date:** 2026-08-19

### Decision
All backend API routes (`/api/*`), database models (`models/`), and library files (`lib/`) remain unchanged during the MVP redesign.

### Context
The backend handles student authentication, material upload/download, and admin management. These features work and are not part of the visual redesign scope.

### Alternatives
- **Refactor backend to TypeScript** — Better type safety
- **Add input validation** — More secure API routes
- **Add proper auth middleware** — Current auth is basic (localStorage)

### Reasoning
1. The client's request is for design and SEO — not backend changes.
2. Backend changes introduce risk of breaking working functionality.
3. Backend improvements can be a Phase 2 project.
4. Current localStorage auth is functional for the institute's needs.

### Consequences
- API routes remain in JavaScript (not TypeScript).
- Authentication remains basic (localStorage-based).
- Input validation is minimal.
- These are documented as technical debt for Phase 2.

### Status
**Accepted**

---

## ADR-007 — Remove Custom Cursor from Default Behavior

**Date:** 2026-08-19

### Decision
Remove `cursor: none` from the body element. The custom cursor component (CursorFollower) will be removed entirely.

### Context
The current home page sets `cursor: none` on the body and renders a custom orange dot + ring cursor that follows the mouse. This causes:
1. No cursor visible on mobile/touch devices (confusing)
2. Accessibility issues for users who rely on the native cursor
3. Users cannot see the cursor on pages that don't render the CursorFollower component
4. `cursor: none` + `mix-blend-mode: difference` causes visual glitches on some elements

### Alternatives
- **Keep custom cursor on desktop only** — Use media query to hide on touch devices
- **Simplify cursor** — Just change cursor color/shape via CSS

### Reasoning
1. The custom cursor adds complexity without meaningful UX improvement.
2. Accessibility best practices recommend keeping the native cursor.
3. The cursor effect works poorly across pages (only renders on home page currently).
4. Professional websites rarely use custom cursors.

### Consequences
- The CursorFollower component will be removed.
- `cursor: none` will be removed from body styles.
- The site will use the browser's native cursor.
- This simplifies the codebase and improves accessibility.

### Status
**Accepted**
