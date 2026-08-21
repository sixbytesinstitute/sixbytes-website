# Agent Skills Usage & Governance Policy

This policy governs the invocation, loading, and lifecycle of skills in this codebase.

---

## 1. Progressive Skill Loading — CRITICAL
- **Do NOT load every skill for every task.**
- Use progressive disclosure:
  1. Determine what the task actually requires.
  2. Identify the minimum relevant skills.
  3. Load **only** those skills.
  4. Load additional skills only when the task expands into another domain.

### Examples:
- **Simple React UI polish**: `frontend-design` ──► `browser-verification` ──► DONE (Do NOT load `database`, `security`, `devops`, `backend`, `performance`, `git-workflow`).
- **New Auth Route**: `writing-plans` ──► `backend` ──► `security` ──► `database` ──► `test-driven-development` ──► `verification-before-completion`.

---

## 2. Skill Selection & Classification Rules
Before starting implementation, classify the task domain and select only strictly necessary skills:
- **Frontend / Styling**: `frontend-design`, `responsive-design`, `accessibility`, `browser-verification`
- **API / Logic**: `backend`, `security`, `database`, `test-driven-development`
- **Database / Schema**: `database`, `security`
- **Optimization**: `performance` (Measure ──► Identify ──► Optimize ──► Measure Again)
- **Code Health**: `refactoring`, `dependency-management`
- **Planning & Execution**: `brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`
- **Quality & Delivery**: `verification-before-completion`, `requesting-code-review`, `finishing-a-development-branch`, `documentation`

---

## 3. Skill Precedence & Priority
When multiple skills or rules apply, resolve conflicts using this hierarchy:
```
Project-specific rules (AGENTS.md / GEMINI.md)
  └── Project architecture & design specs (/docs)
        └── Security constraints (security skill)
              └── Core engineering workflows (Superpowers)
                    └── Domain-specific skills (backend, frontend-design, database)
                          └── Task-specific skills
```

---

## 4. Evidence-Based Skill Usage
- Do not invoke a skill simply because its name sounds related.
- Load a skill **only** if it provides knowledge or a workflow that materially improves the current task.
- Target: **Maximum useful capability + Minimum unnecessary context**.

---

## 5. Mandatory Verification Pipeline
For all meaningful changes, the agent must adhere to:
```
Understand ──► Plan ──► Implement ──► Test / Verify ──► Review ──► Document
```
Never claim a task is complete solely because code was written. Completion requires concrete evidence:
- Automated tests passing
- TypeScript compilation and Next.js production build (`npm run build`) passing with zero errors
- Browser visual verification across desktop and mobile viewports
- Database operations and API responses verified
- Documentation in `/docs` updated (`TASKS.md`, `CONTEXT.md`, etc.)
