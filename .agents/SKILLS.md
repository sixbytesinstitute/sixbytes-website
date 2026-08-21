# Installed Agent Skills & Version Registry

This file tracks all installed skills in `.agents/skills/`, their upstream origins, purposes, and customization status.

---

## 1. Core Engineering & Process Skills (Upstream: `obra/superpowers`)

### Brainstorming
- **Source**: `obra/superpowers`
- **Source Path**: `skills/brainstorming/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Explore user intent, requirements, and design before implementation.
- **Modified**: No

### Writing Plans
- **Source**: `obra/superpowers`
- **Source Path**: `skills/writing-plans/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Create structured, phased implementation plans for multi-step tasks before touching code.
- **Modified**: No

### Executing Plans
- **Source**: `obra/superpowers`
- **Source Path**: `skills/executing-plans/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Execute written plans with disciplined checkpoints and verification.
- **Modified**: No

### Test-Driven Development (TDD)
- **Source**: `obra/superpowers`
- **Source Path**: `skills/test-driven-development/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Test-first implementation workflow (Red-Green-Refactor) for robust feature and bugfix delivery.
- **Modified**: No

### Systematic Debugging
- **Source**: `obra/superpowers`
- **Source Path**: `skills/systematic-debugging/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Root-cause tracing and hypothesis-driven debugging before proposing code changes.
- **Modified**: No

### Verification Before Completion
- **Source**: `obra/superpowers`
- **Source Path**: `skills/verification-before-completion/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Enforce evidence-based completion verification before claiming success.
- **Modified**: No

### Requesting Code Review
- **Source**: `obra/superpowers`
- **Source Path**: `skills/requesting-code-review/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Structured self-review and peer code review workflows.
- **Modified**: No

### Using Git Worktrees
- **Source**: `obra/superpowers`
- **Source Path**: `skills/using-git-worktrees/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Create isolated git worktree environments for clean task execution.
- **Modified**: No

### Subagent-Driven Development
- **Source**: `obra/superpowers`
- **Source Path**: `skills/subagent-driven-development/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Orchestrate subagents to implement independent tasks in implementation plans.
- **Modified**: No

### Dispatching Parallel Agents
- **Source**: `obra/superpowers`
- **Source Path**: `skills/dispatching-parallel-agents/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Coordinate concurrent, non-overlapping tasks across parallel subagents.
- **Modified**: No

### Finishing a Development Branch
- **Source**: `obra/superpowers`
- **Source Path**: `skills/finishing-a-development-branch/SKILL.md`
- **Version / Commit**: `main` (commit `b36e082`)
- **Purpose**: Clean up, verify, merge/rebase, and finalize development branches.
- **Modified**: No

---

## 2. Specialized Frontend Skills

### Frontend Design
- **Source**: `anthropics/claude-code`
- **Source Path**: `plugins/frontend-design/skills/frontend-design/SKILL.md`
- **Version / Commit**: `main`
- **Purpose**: Distinctive, intentional, production-quality visual design and component craft.
- **Modified**: No

### Accessibility
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/accessibility/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: WCAG 2.1 AA compliance, ARIA patterns, keyboard navigation, and contrast validation.
- **Modified**: No

### Responsive Design
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/responsive-design/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Mobile-first architecture, breakpoint strategy, fluid typography, and touch ergonomics.
- **Modified**: No

### Browser Verification
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/browser-verification/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Multi-breakpoint visual verification, responsive checks, and layout validation.
- **Modified**: No

---

## 3. Specialized Backend, Data & Security Skills

### Backend
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/backend/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: RESTful API design, Next.js App Router route handlers, input validation, and service architecture.
- **Modified**: No

### Database
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/database/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: MongoDB schema design, indexing, connection pooling, and query profiling.
- **Modified**: No

### Security
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/security/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: OWASP Top 10 mitigation, auth hardening, input sanitization, secrets management, and upload security.
- **Modified**: No

---

## 4. Operational, Quality & Governance Skills

### Git Workflow
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/git-workflow/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Conventional commits, branch lifecycles, PR preparation, merge conflict resolution, and release tagging.
- **Modified**: No

### DevOps
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/devops/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Docker multi-stage builds, GitHub Actions CI/CD pipelines, health checks, secrets, and rollbacks.
- **Modified**: No

### Performance
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/performance/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Core Web Vitals, API throughput, query optimization, bundle reduction, and measurement-first tuning.
- **Modified**: No

### Dependency Management
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/dependency-management/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Strict package evaluation, compatibility checks, security auditing, and bloat prevention.
- **Modified**: No

### Refactoring
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/refactoring/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Code smell elimination (duplicate code, oversized modules, circular dependencies) without behavioral change.
- **Modified**: No

### Documentation
- **Source**: Project Custom / Local Engineering Standard
- **Source Path**: `.agents/skills/documentation/SKILL.md`
- **Version / Commit**: `v1.0.0`
- **Purpose**: Context preservation and maintenance of `docs/` (`PRD.md`, `ARCHITECTURE.md`, `TASKS.md`, `DECISIONS.md`, `CONTEXT.md`, `DESIGN.md`).
- **Modified**: No
