---
name: performance
description: "Systematic performance optimization covering frontend performance (Core Web Vitals, rendering, bundle size), backend latency, API throughput, database query profiling, caching strategies, and memory/CPU profiling. Enforces: Measure -> Identify Bottleneck -> Optimize -> Measure Again. Use when addressing slowness, high latency, large bundle sizes, or optimization tasks."
---

# Performance Engineering & Optimization

## When to Load
- Investigating slow page load times or poor Core Web Vitals (LCP, FID/INP, CLS)
- Diagnosing high backend/API latency
- Optimizing database query execution times
- Reducing JavaScript bundle sizes and eliminating code bloat
- Implementing caching layers (HTTP cache headers, CDN, in-memory caches)
- Resolving CPU thrashing, memory leaks, or rendering jank

<HARD-GATE>
Strictly follow the scientific optimization loop:
Measure ──► Identify Bottleneck ──► Optimize ──► Measure Again
Do NOT perform speculative optimizations without baseline measurements and clear evidence.
</HARD-GATE>

## Optimization Methodology

```
┌─────────────────────────────────────────────────────────┐
│ 1. MEASURE: Establish baseline metrics & profile        │
├─────────────────────────────────────────────────────────┤
│ 2. IDENTIFY: Pinpoint the precise bottleneck            │
├─────────────────────────────────────────────────────────┤
│ 3. OPTIMIZE: Apply targeted, surgical improvements      │
├─────────────────────────────────────────────────────────┤
│ 4. VERIFY: Measure again & document delta               │
└─────────────────────────────────────────────────────────┘
```

## Frontend Performance & Core Web Vitals

### Target Metrics
| Metric | Full Name | Good Target | Common Bottlenecks |
|---|---|---|---|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | Large unoptimized hero images, slow server TTFB, render-blocking scripts |
| **INP** | Interaction to Next Paint | ≤ 200ms | Heavy JavaScript execution on main thread, unoptimized re-renders |
| **CLS** | Cumulative Layout Shift | ≤ 0.1 | Images/embeds without explicit width & height, dynamic DOM injection |
| **FCP** | First Contentful Paint | ≤ 1.8s | Render-blocking CSS, slow DNS lookup, heavy fonts |

### Frontend Optimization Checklist
- [ ] Next.js Image Component (`next/image`) with `sizes` and `priority` on above-the-fold hero images.
- [ ] Font optimization: `font-display: swap`, preload critical web fonts, use subsetting.
- [ ] Eliminate layout shifts: Explicit `width` and `height` (or aspect ratio) on images and canvas containers.
- [ ] Dynamic imports: Use `next/dynamic` or `React.lazy()` for heavy below-the-fold components (e.g. interactive 3D canvases, map widgets).
- [ ] Minimize CSS overhead: Consolidate duplicate style declarations, purge unused CSS.
- [ ] Reduce particle/animation canvas load: Decrease particle count on mobile screens and pause RAF loops when tab is hidden (`visibilitychange`).

## Backend & API Optimization

### Latency Reduction
- Keep Time To First Byte (TTFB) < 300ms.
- Avoid N+1 database queries; batch queries or use projection/population.
- Cache idempotent GET requests with proper `Cache-Control` headers (e.g., `s-maxage=3600, stale-while-revalidate`).
- Stream large responses or paginate collections (`limit` and `skip`/cursor).
- Compress responses with Gzip/Brotli.

## Database Query Profiling (MongoDB)

### Profiling Process
1. Run `.explain("executionStats")` on slow queries.
2. Check `totalDocsExamined` vs `nReturned`:
   - If `totalDocsExamined >> nReturned`, the query is performing a full collection scan (COLLSCAN).
   - Solution: Create a compound index covering the query predicate and sort keys.
3. Select only needed fields: `.select('name email class')`.
4. Avoid regex queries without prefix anchors (e.g., avoid `.*abc.*`, prefer indexed text search or anchored `^abc`).

## Bundle Size & Memory Optimization

### Measuring Bundle Size
```bash
# Analyze Next.js bundle sizes
ANALYZE=true npm run build
```

### Bundle Size Rules
- Audit third-party packages before adding (`bundlephobia.com`).
- Import specific named exports, not entire packages (e.g. `import debounce from 'lodash/debounce'`).
- Avoid duplicate packages or polyfills for modern browser environments.

## Performance Verification Report Template

```markdown
## Performance Optimization Report
- **Target Component / Route**: `/courses`
- **Metric Targeted**: LCP / Bundle Size / Query Latency

### 1. Baseline Measurement
- Initial Metric Value: [e.g. LCP = 3.8s]
- Tool Used: Lighthouse / Chrome DevTools Performance / MongoDB explain()

### 2. Root Cause Identified
- Bottleneck: [e.g., 1.8MB uncompressed hero.jpg blocking LCP]

### 3. Optimization Applied
- Action: [e.g., Converted hero.jpg to optimized WebP with responsive srcset and priority flag]

### 4. Post-Optimization Measurement
- Final Metric Value: [e.g. LCP = 1.4s]
- Improvement: [e.g. 63% reduction in LCP]
```
