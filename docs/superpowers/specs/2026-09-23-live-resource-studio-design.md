# Live Split-Screen Resource Studio & Visual Block Builder Specification

**Status:** Approved  
**Author:** Antigravity  
**Date:** September 23, 2026  
**Audience:** SixBytes Educational Institute engineering & content management  

---

## 1. Overview & Problem Statement

Currently, when administrators or content managers create educational resources at `/admin/resources` and `/manager/resources`, they only have a plain single `<textarea>` that expects raw HTML. 
- There is **no visual feedback** or live preview of how the resource will render on `sixbytes.in/resources/[slug]`.
- Content creators cannot easily insert **Solved Question Cards**, **Copyable Program/Code Boxes**, **Chemical Reaction / Math Formula Callouts**, **Exam Pro-Tips**, **Interactive Comparison Tables**, or **Table of Contents** without manually typing complex HTML markup.
- Creators cannot preview how their page will appear on mobile phones versus desktop, nor can they preview the Google SERP search snippet or verify Schema.org SEO structured data before publishing.

## 2. Proposed Architecture & System Design

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Top Navigation & Control Bar                    │
│  [Title] [Slug] [Class] [Subject] [Type] | [View: Blocks | Raw] |      │
├───────────────────────────────────┬────────────────────────────────────┤
│         LEFT PANE (Editor)        │        RIGHT PANE (Live Preview)   │
│                                   │                                    │
│ ┌─ Component Block Palette ─────┐ │ ┌─ Google SERP Snippet Preview ─┐  │
│ │ [+ Question] [+ Code Box]     │ │ │ SixBytes | CBSE Class 10 ...  │  │
│ │ [+ Formula]  [+ Exam Tip]     │ │ │ sixbytes.in/resources/slug    │  │
│ │ [+ Table]    [+ Heading]      │ │ └───────────────────────────────┘  │
│ └───────────────────────────────┘ │                                    │
│                                   │ ┌─ Production Article Preview ────┐ │
│ ┌─ Reorderable Block Canvas ────┐ │ │ (Interactive public styling:    │ │
│ │ ☰ Heading 2: Refraction Laws  │ │ │  Copy buttons active,           │ │
│ │ ☰ Question & Solution Card    │ │ │  Q&A collapsible testable,      │ │
│ │ ☰ Python / Java Code Box      │ │ │  Formula callouts,              │ │
│ │ ☰ Comparison Table            │ │ │  Responsive & Dark/Light theme) │ │
│ └───────────────────────────────┘ │ └─────────────────────────────────┘ │
└───────────────────────────────────┴────────────────────────────────────┘
```

### 2.1 Core Subsystems

1. **`ResourceStudio` Component (`app/components/resources/resource-studio.tsx`)**
   - Fullscreen split-screen modal / studio drawer.
   - Dual-mode editor:
     - **Visual Block Mode**: Structured form controls for 8 component types with drag-and-drop or move up/down, duplicate, and delete actions.
     - **Raw Code Mode**: Bidirectionally synchronized HTML editor for power users.
   - Device preview frame: Desktop (100%), Tablet (768px), Mobile (390px).
   - Theme preview switcher: Dark mode (`#0a0c0e`) vs Light mode (`#f8fafc`).
   - Live Google SERP search result simulator with character counters.

2. **Block Component Definitions & HTML Compilers (`lib/resource-blocks.ts`)**
   - Pure, deterministic conversion between visual block JSON state and semantic, sanitized HTML.
   - Supported blocks:
     - `heading` (`h2`, `h3` with automatic anchor IDs)
     - `paragraph` (rich text paragraphs and lists)
     - `question_card` (question text, marks/badge, collapsible step-by-step solution)
     - `code_box` (language tag, monospace formatted code, copy-code button target)
     - `formula_callout` (math/science equations with stylized blue accent)
     - `concept_callout` (exam tips and caution boxes with amber accent)
     - `table` (headers, rows, responsive wrapper)
     - `toc` (auto-generated or manual table of contents)

3. **SEO & Automatic Indexing Enhancements**
   - Auto-detection of `Question` blocks to inject Schema.org `FAQPage` or `Quiz` structured data alongside `LearningResource` and `Article`.
   - IndexNow instant submission on publish and update (`https://api.indexnow.org/indexnow`).
   - Ping search engine sitemaps automatically.

4. **Portal Integration**
   - Seamlessly integrated into both `/admin/resources` and `/manager/resources`.
   - Replaces the legacy modal with the new live Studio while preserving all existing database records.

---

## 3. Data Model & Compatibility

- **Backward Compatibility**: Existing resources store `content: string` (HTML). The Studio's parser can ingest existing HTML into the raw editor or parse standard blocks, ensuring zero breaking changes.
- **Resource Types**:
  - `topic_guide` (Conceptual notes)
  - `question_bank` (10 Solved Board & PYQ Questions)
  - `formula_sheet` (Formula cheatsheet & rapid revision)
  - `program_tutorial` (Computer Applications / Programming guides)
