# Live Resource Studio & Visual Block Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use test-driven-development and verification-before-completion.

This plan details the implementation of a full split-screen visual resource studio for administrators and content managers, enabling live LaTeX-style preview, drag-and-drop block building, Question & Solution cards, Code boxes with copy buttons, Formula callouts, and automatic search engine indexing.

---

## User Review Required

> [!IMPORTANT]
> - **Schema Update**: Adds `program_tutorial` to `models/Resource.ts` `resourceType` enum.
> - **Auto-Indexing**: Automatically dispatches IndexNow notifications upon publishing/updating any resource.
> - **Zero Breaking Changes**: Existing 42 resources remain 100% compatible.

---

## Proposed Changes

### Core Library & Models

#### [models/Resource.ts](file:///d:/sixbytes-website/models/Resource.ts)
- Add `"program_tutorial"` to `resourceType` enum.

#### [lib/resource-blocks.ts](file:///d:/sixbytes-website/lib/resource-blocks.ts)
- Block type definitions (`HeadingBlock`, `ParagraphBlock`, `QuestionBlock`, `CodeBlock`, `FormulaBlock`, `ConceptBlock`, `TableBlock`, `TocBlock`).
- Serializer (`blocksToHtml`): Converts blocks array to sanitized, semantic HTML matching production classes (`.qa-card`, `.program-box`, `.formula-callout`, etc.).
- Deserializer (`htmlToBlocks`): Parses HTML into blocks for seamless visual editing of existing articles, with fallback to raw HTML.
- Template generators: Pre-populated starters for "Question Bank (Top 10 Board Questions)", "Programming Tutorial (Python / Java)", "Formula Cheatsheet", and "Concept Guide".

---

### Component Layer

#### [app/components/resources/resource-studio.tsx](file:///d:/sixbytes-website/app/components/resources/resource-studio.tsx)
- Fullscreen split-screen Studio modal.
- Left Pane:
  - Top meta bar: Title, Slug, Subject, Class, Board, Resource Type, Keywords, Meta Description with char counters.
  - Component Palette: Quick insert buttons / drag targets for Question, Code Box, Formula, Exam Tip, Table, Headings.
  - Block Canvas: Reorderable cards with move up/down, duplicate, delete, and inline field editing.
  - Mode toggle: Visual Blocks vs Raw HTML Code.
- Right Pane:
  - Google SERP Simulator card (shows exact title, url, snippet).
  - Responsive Viewport switch: Desktop (100%), Tablet (768px), Mobile (390px).
  - Theme Preview switch: Dark mode vs Light mode.
  - Interactive Preview: Live rendered HTML using `.resource-content-area` styles with working copy-code buttons and collapsible solution accordions.

#### [app/components/resources/serp-preview.tsx](file:///d:/sixbytes-website/app/components/resources/serp-preview.tsx)
- Modular Google Search snippet preview component.

---

### Integration & Pages

#### [app/admin/resources/page.tsx](file:///d:/sixbytes-website/app/admin/resources/page.tsx)
- Replace legacy modal with `ResourceStudio`.
- "New Resource" and "Edit" buttons open the studio with full draft saving and live preview.

#### [app/manager/resources/page.tsx](file:///d:/sixbytes-website/app/manager/resources/page.tsx)
- Update manager resource page to also use `ResourceStudio`.

#### [app/resources/[slug]/page.tsx](file:///d:/sixbytes-website/app/resources/[slug]/page.tsx)
- Add Schema.org `FAQPage` structured data detection when Question cards are present in the resource content.

---

## Verification Plan

### Automated Tests
- Test unit suite for `lib/resource-blocks.ts` testing block serialization, deserialization, template generation, and HTML sanitization:
  - Run via: `node --test tests/resource-blocks.test.mjs`
- Test build integrity:
  - Run via: `npm run build`

### Manual & Browser Verification
- Open `/admin/resources` in the browser.
- Open the Studio:
  - Add a Question & Solution card.
  - Add a Python Code block.
  - Add a Formula callout.
  - Check that the Right Pane updates instantly in real time.
  - Switch to Mobile preview (390px) and verify responsive wrapping.
  - Switch to Light mode and verify contrast.
  - Test the Copy button on the code block in the preview.
  - Test saving as draft and publishing.
