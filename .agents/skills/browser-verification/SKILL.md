---
name: browser-verification
description: "Browser-based visual verification of UI changes using screenshots, dev tools, and automated visual testing. Use when verifying frontend changes look correct across breakpoints."
---

# Browser-Based Visual Verification

## When to Load
- After implementing UI changes
- When fixing responsive layout issues
- After CSS/styling modifications
- When user reports visual bugs

## Verification Process

### Step 1: Local Development Server
```bash
npm run dev
```
Verify the dev server is running before checking.

### Step 2: Visual Inspection Checklist
For each page or component changed:

1. **Desktop (1440px)**
   - Layout correct, no overflow
   - Typography renders correctly
   - Colors match design system
   - Animations play smoothly
   - Hover states work

2. **Tablet (768px)**
   - Layout adapts correctly
   - No horizontal scroll
   - Navigation switches to mobile menu
   - Content readable without zooming

3. **Mobile (375px)**
   - Content stacks vertically
   - Touch targets sufficient (≥48px)
   - Text legible
   - Images scale down properly
   - Forms usable

### Step 3: Functional Verification
- All links navigate correctly
- Forms submit successfully
- Modals/dropdowns open and close
- Scroll behavior works
- Lazy-loaded content appears on scroll

### Step 4: Cross-Browser Checks
- Chrome (primary)
- Firefox
- Safari (if available)
- Edge

## Using Browser DevTools

### Responsive Mode
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device preset or enter custom dimensions
4. Check all target breakpoints

### Performance Panel
1. Open Performance tab
2. Record page load
3. Check for:
   - Layout shifts (CLS)
   - Long tasks (> 50ms)
   - Render blocking resources

### Lighthouse Audit
1. Open Lighthouse tab in DevTools
2. Run audit for: Performance, Accessibility, SEO, Best Practices
3. Target scores:
   - Performance: ≥ 85
   - Accessibility: ≥ 90
   - SEO: ≥ 90
   - Best Practices: ≥ 90

## Screenshot Comparison

### Manual Process
1. Take screenshots at each breakpoint before changes
2. Make changes
3. Take screenshots at same breakpoints after changes
4. Compare side-by-side

### Key Pages to Check
- Homepage hero section
- Navigation (open and closed states)
- Course cards
- Results/toppers section
- Contact form and map
- Footer

## Common Visual Bugs

| Issue | How to Detect | Fix |
|---|---|---|
| Text overflow | Resize browser, check for clipping | Add `overflow-wrap: break-word` |
| Layout shift | Lighthouse CLS metric | Set explicit dimensions on images/embeds |
| Z-index stacking | Open modal over navbar | Audit z-index values |
| Font flash (FOUT) | Watch page load closely | Use `font-display: swap` |
| Animation jank | Record Performance timeline | Use `transform` instead of `top/left` |

## Verification Report Template

```
## Visual Verification Report
Page: [page name]
Date: [date]

### Desktop (1440px)
- [ ] Layout correct
- [ ] Typography correct
- [ ] Colors match design system
- [ ] Animations smooth

### Tablet (768px)
- [ ] Responsive layout works
- [ ] No horizontal scroll
- [ ] Mobile nav functional

### Mobile (375px)
- [ ] Content stacks correctly
- [ ] Touch targets sufficient
- [ ] Text legible

### Functional
- [ ] All links work
- [ ] Forms functional
- [ ] Scroll behavior correct

### Issues Found
[List any issues]
```
