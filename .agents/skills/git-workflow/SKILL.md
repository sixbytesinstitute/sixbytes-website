---
name: git-workflow
description: "Git version control operations, branching strategies, semantic commit conventions, PR workflows, rebasing, merge conflict resolution, cherry-picking, tagging/releases, and worktrees. Use when managing version control, branch lifecycles, or resolving git conflicts."
---

# Git & GitHub Engineering Workflow

## When to Load
- Creating and managing feature/fix branches
- Formatting and structuring commit messages
- Preparing pull requests and branch summaries
- Rebasing, interactive rebasing, and squash workflows
- Resolving complex merge conflicts
- Safe cherry-picking, reverting, or history restoration
- Managing version tags and release workflows

## Branching Strategy & Lifecycle

### Branch Naming Conventions
- Feature branches: `feat/<feature-name>` or `feature/<ticket-or-description>`
- Bugfix branches: `fix/<issue-name>` or `bugfix/<description>`
- Refactor branches: `refactor/<module-name>`
- Chore / Docs / DevOps: `chore/<description>`, `docs/<topic>`, `ci/<pipeline>`

### Branch Workflow
1. Ensure the base branch (`main` or `develop`) is clean and up to date.
2. Create an isolated branch or worktree:
   ```bash
   git checkout -b feat/redesign-hero
   ```
3. Keep feature branches short-lived to minimize merge conflicts.

## Semantic Commit Conventions

Follow standard Conventional Commits:
```
<type>(<scope>): <short summary>

[optional body explaining intent and context]

[optional footer, e.g., Closes #123]
```

### Commit Types
- `feat`: New feature or user-facing functionality
- `fix`: Bugfix for existing functionality
- `refactor`: Code changes that neither fix a bug nor add a feature
- `style`: Formatting, missing semicolons, CSS polish with no logic change
- `docs`: Documentation updates (e.g. in `/docs`)
- `test`: Adding or correcting unit/integration tests
- `chore`: Build tasks, dependency updates, tooling config

### Rules for Good Commits
- Make atomic commits: one logical change per commit.
- Use the imperative mood in subject lines ("Add hero section" not "Added hero section").
- Do not commit secrets, environment `.env` files, or build artifacts (`.next`, `dist`, `node_modules`).

## Merging, Rebasing & Conflict Resolution

### Keeping Branches Updated
Prefer rebasing feature branches onto the updated base branch to keep linear history:
```bash
git fetch origin
git rebase origin/main
```

### Conflict Resolution Procedure
1. Identify conflicting files via `git status`.
2. Open conflicting files and locate markers `<<<<<<<`, `=======`, `>>>>>>>`.
3. Resolve conflict in favor of the correct combined logic.
4. Verify tests pass and compilation succeeds.
5. Stage resolved files: `git add <file>`.
6. Complete rebase or merge:
   ```bash
   git rebase --continue
   # OR
   git commit -m "Merge branch 'main' into feat/redesign"
   ```

### Reverting vs. Resetting
- In shared branches: **Always** use `git revert <commit-hash>` to preserve history.
- In private, unpushed branches: `git reset --soft HEAD~1` to amend or squash commits.

## Pull Requests & Code Review Preparation

### PR Checklist
- [ ] Branch is rebased onto the latest base branch
- [ ] All automated tests and builds pass cleanly
- [ ] PR description clearly states: Summary of changes, Motivation, Testing verification evidence
- [ ] Self-review conducted on `git diff` before assigning reviewers
- [ ] Documentation updated in `/docs` if architecture, tasks, or decisions changed

## Tags and Releases

```bash
# Lightweight tag for internal checkpoints
git tag v1.0.0-alpha

# Annotated tag for production releases
git tag -a v1.0.0 -m "Release v1.0.0: SixBytes Website Redesign"
git push origin v1.0.0
```
