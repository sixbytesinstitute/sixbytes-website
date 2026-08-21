---
name: dependency-management
description: "Dependency governance and evaluation framework. Enforces rigorous checks before adding packages: verifying existing capabilities, maintenance/activity, compatibility, security vulnerabilities, bundle/runtime impact, and license compatibility. Prohibits trivial packages that can be reasonably implemented in-house."
---

# Dependency Management & Governance

## When to Load
- Considering installing a new npm/yarn package
- Upgrading or replacing existing dependencies
- Auditing project dependencies for security vulnerabilities (`npm audit`)
- Pruning unused or bloated dependencies from `package.json`

## Pre-Installation Evaluation Checklist

<HARD-GATE>
Before installing ANY new package, you MUST complete every step of the dependency evaluation pipeline. Never install a package for trivial functionality that can reasonably be implemented in 10-30 lines of standard code.
</HARD-GATE>

### 1. Existing Project Capabilities Check
- [ ] **Can native platform APIs handle this?** (e.g. native `fetch`, `URLSearchParams`, CSS animations, `IntersectionObserver`, `crypto.randomUUID()`)
- [ ] **Does an already-installed dependency solve this?** (e.g. Next.js built-ins, React hooks, Tailwind utilities)
- [ ] **Is the logic trivial?** (e.g. `is-odd`, `left-pad`, simple string formatters, basic debounce — write these directly in `lib/utils.ts` instead)

### 2. Maintenance & Health Evaluation
- [ ] Recent commit activity within the last 6-12 months?
- [ ] Active issue triage and response from maintainers?
- [ ] Weekly download volume and widespread adoption?
- [ ] No deprecation notices or unmaintained flags?

### 3. Compatibility & Ecosystem Check
- [ ] Compatible with the current Node.js version (Node 20+)?
- [ ] Compatible with React version (React 19) and Next.js (Next.js 16 App Router)?
- [ ] Full TypeScript support (built-in types or `@types/*` package available)?
- [ ] ESM / CommonJS module compatibility with the bundler?

### 4. Security & Vulnerability Check
- [ ] Run `npm audit` or check Snyk/Socket.dev for known CVEs.
- [ ] Zero critical or high-severity unpatched vulnerabilities.
- [ ] Verify package authorship to avoid typosquatting risks.

### 5. Bundle & Runtime Performance Impact
- [ ] Check package size on Bundlephobia (`minified + gzipped`).
- [ ] Does it support tree-shaking (pure ES modules)?
- [ ] Will it inflate the client-side JavaScript bundle unnecessarily?

### 6. Licensing Verification
- [ ] Permissive open-source license compatible with commercial usage (MIT, Apache 2.0, BSD-2/3-Clause, ISC).
- [ ] Strictly avoid GPL / AGPL licenses in proprietary / commercial codebases unless explicitly cleared.

## Dependency Installation Procedure

### Adding a Dependency
```bash
# Production dependency
npm install <package-name>

# Development dependency
npm install -D <package-name>
```

### Post-Install Verification
1. Verify `package-lock.json` was updated cleanly without resolving conflicting dependency trees.
2. Run build verification:
   ```bash
   npm run build
   ```
3. Run tests to confirm zero regressions:
   ```bash
   npm test --if-present
   ```

## Removing Unused Dependencies

1. Search the codebase for imports of the candidate package:
   ```bash
   # Example check across all source files
   git grep "from 'package-name'"
   ```
2. Remove package:
   ```bash
   npm uninstall <package-name>
   ```
3. Run `npm run build` to ensure no broken references remain.
