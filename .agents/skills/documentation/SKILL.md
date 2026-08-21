---
name: documentation
description: "Documentation maintenance framework for project documentation in /docs: PRD.md, ARCHITECTURE.md, TASKS.md, DECISIONS.md, CONTEXT.md, and DESIGN.md. Enforces persistent project context, synchronized architecture tracking, decision records (ADRs), task status updates, and prevention of context drift across agent sessions."
---

# Documentation Maintenance & Context Governance

## When to Load
- Creating, updating, or maintaining files inside `/docs`
- Starting a new feature or architectural phase (syncing `PRD.md` and `ARCHITECTURE.md`)
- Logging an architectural, UX, or design decision (creating an ADR in `DECISIONS.md`)
- Updating task progress and completion status in `TASKS.md`
- Updating session state, tech stack snapshot, or blockers in `CONTEXT.md`
- Establishing or amending visual design tokens in `DESIGN.md`

## The 6 Core Documentation Artifacts

Every agent session must understand the specific role and maintenance rules for the documentation files in `/docs`:

```
docs/
├── PRD.md           ── Product Requirements Document (Goals, User Stories, Scope, Acceptance Criteria)
├── ARCHITECTURE.md  ── System Architecture (Component hierarchy, Data flow, API routes, Tech stack)
├── TASKS.md         ── Detailed Task Breakdown (Phased tasks, dependencies, completion checkboxes)
├── DECISIONS.md     ── Architecture Decision Records (ADRs: context, decision, trade-offs, status)
├── CONTEXT.md       ── Living Project Context (Current active phase, immediate blockers, constraints)
└── DESIGN.md        ── Visual Design System (Color tokens, typography scale, component specs)
```

---

## File Responsibilities & Update Triggers

### 1. `docs/PRD.md`
- **Purpose**: Single source of truth for product goals, user personas, functional/non-functional requirements, MVP scope, and acceptance criteria.
- **Update When**: Scope changes, new user requirements are requested, or acceptance criteria are modified.

### 2. `docs/ARCHITECTURE.md`
- **Purpose**: Structural blueprint of the codebase, directory layouts, component trees, API contracts, data models, and external integrations.
- **Update When**: New directories, routes, models, services, or shared utility libraries are added or restructured.

### 3. `docs/TASKS.md`
- **Purpose**: Granular, phased execution roadmap with checklist boxes (`[ ]` / `[x]`), task IDs, dependencies, and verification criteria.
- **Update When**:
  - A task begins: Mark as in-progress.
  - A task completes with verification: Check off `[x]` and log evidence.
  - New tasks or subtasks are discovered: Add to the appropriate phase.

### 4. `docs/DECISIONS.md`
- **Purpose**: Chronological register of Architecture Decision Records (ADRs).
- **Format Required for Each ADR**:
  ```markdown
  ## ADR-00X — [Descriptive Title]
  **Date:** YYYY-MM-DD
  **Status:** Proposed | Accepted | Deprecated | Superseded
  ### Context
  [What problem or question triggered this decision?]
  ### Decision
  [What was chosen and why?]
  ### Alternatives Considered
  [What alternative approaches were evaluated and why were they rejected?]
  ### Consequences
  [Positive outcomes and accepted trade-offs/technical debt]
  ```

### 5. `docs/CONTEXT.md`
- **Purpose**: Fast context restoration for future agent sessions without requiring entire conversation transcript parsing.
- **Contents**: Current project milestone, immediate next task, known technical debt, environment constraints, and asset inventory.
- **Update When**: Completing any major task, changing active focus, or encountering critical blockers.

### 6. `docs/DESIGN.md`
- **Purpose**: Authoritative visual design specification — HSL/Hex color palettes, font families and sizing scales, elevation/glass-morphism tokens, and micro-animation specs.
- **Update When**: Defining or modifying styling tokens, theme rules, or component visual guidelines.

---

## Documentation Quality Standards

1. **Precision & Accuracy**: Keep documentation synchronized with active code. Outdated documentation is actively harmful.
2. **Clickable File References**: Use relative markdown links to source files where applicable.
3. **No Hallucinations**: Never document features, APIs, or database schemas that do not exist or have not been designed.
4. **Structured Tables & Diagrams**: Use Markdown tables and Mermaid diagrams for high readability and scannability.
