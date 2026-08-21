---
name: refactoring
description: "Disciplined code refactoring framework targeting code smells: duplicate code, dead code, excessive complexity, circular dependencies, poor separation of concerns, oversized modules/components, and brittle abstractions. Enforces: Preserve behavior, verify with tests, do not refactor functioning code solely for personal style preferences."
---

# Code Refactoring & Maintainability Engineering

## When to Load
- Eliminating duplicated code across components or routes
- Removing dead, unreachable, or orphaned code and assets
- Breaking down oversized, monolithic components (>300 lines) into focused sub-components
- Untangling circular dependencies or tight coupling between modules
- Improving separation of concerns (e.g. separating data fetching, business logic, and UI rendering)
- Cleaning up brittle or leaky abstractions

<HARD-GATE>
Refactoring is restructuring code WITHOUT changing its observable external behavior.
Do NOT refactor functioning, readable code simply because you prefer an alternative syntax or personal style preference. Refactoring must solve an identifiable architectural smell or maintainability issue.
</HARD-GATE>

## Core Principles of Safe Refactoring

```
┌─────────────────────────────────────────────────────────┐
│ 1. BASELINE: Ensure automated tests or verification     │
│    checkpoints exist before touching code.              │
├─────────────────────────────────────────────────────────┤
│ 2. ISOLATE: Make small, atomic refactoring steps.       │
│    Do not mix feature additions with refactoring.       │
├─────────────────────────────────────────────────────────┤
│ 3. VERIFY: Run tests & compiler checks after each step. │
├─────────────────────────────────────────────────────────┤
│ 4. COMMIT: Commit refactoring steps independently.      │
└─────────────────────────────────────────────────────────┘
```

## Common Code Smells & Target Patterns

### 1. Duplicate Code (DRY Violation)
- **Symptom**: Copy-pasted helper functions, duplicated CSS animation keyframes, or identical canvas loops across multiple page files.
- **Remedy**: Extract into a single shared utility in `lib/` or shared component in `components/ui/`. Export clean TypeScript interfaces and props.

### 2. Oversized / Monolithic Components
- **Symptom**: Single files containing 600-800 lines with mixed responsibilities (state, canvas loops, SEO markup, forms, inline CSS).
- **Remedy**: Decompose by feature/section:
  ```
  page.tsx (Orchestrator / Composition)
  ├── HeroSection.tsx
  ├── CoursesSection.tsx
  ├── TestimonialsSection.tsx
  └── CtaSection.tsx
  ```

### 3. Poor Separation of Concerns
- **Symptom**: UI components directly executing MongoDB queries or hardcoded API fetches inside render functions.
- **Remedy**: Separate into:
  - **Data Access Layer**: `lib/mongodb.js`, `models/`
  - **API Route Handlers**: `app/api/...`
  - **Presentation Layer**: React Client / Server Components

### 4. Dead Code & Unused Assets
- **Symptom**: Unreferenced functions, commented-out legacy code, unused image assets, and unused imports.
- **Remedy**: Delete dead code immediately. Git history preserves past revisions; commented-out code creates cognitive debt.

### 5. Circular Dependencies
- **Symptom**: Module A imports Module B, which imports Module A, causing bundler initialization errors or `undefined` runtime references.
- **Remedy**: Extract shared types or utility functions into a neutral leaf module (e.g. `types/` or `lib/utils.ts`) that both modules can import independently.

### 6. Bad / Leaky Abstractions
- **Symptom**: A generic component has 20 boolean flags (`isHome`, `isAbout`, `hideOrange`, `isSmallSpecial`) to handle bespoke edge cases.
- **Remedy**: Replace overly complex abstractions with composition (`children`, render props) or distinct, well-named specialized components.

## Refactoring Workflow Checklist

- [ ] Existing behavior is documented and verified.
- [ ] No behavioral or UI changes introduced unintentionally.
- [ ] Single responsibility principle applied to extracted modules.
- [ ] Types and prop definitions remain strictly validated.
- [ ] Automated build (`npm run build`) succeeds with zero errors.
- [ ] All page routes render identically to their pre-refactor state.
