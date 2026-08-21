---
name: accessibility
description: "Web accessibility (WCAG 2.1 AA), ARIA patterns, semantic HTML, keyboard navigation, screen reader compatibility, color contrast, focus management, and reduced motion. Use when building or reviewing UI components for accessibility compliance."
---

# Accessibility Engineering (WCAG 2.1 AA)

## When to Load
- Building new UI components
- Reviewing existing components for accessibility
- Adding interactive elements (modals, menus, accordions)
- Implementing forms
- Working with color/contrast decisions
- Adding animations or motion

## Core Principles (POUR)

### 1. Perceivable
- All non-text content has text alternatives (alt text, aria-label)
- Color is not the only means of conveying information
- Text has sufficient contrast ratio (≥4.5:1 for normal text, ≥3:1 for large text)
- Content can be resized up to 200% without loss

### 2. Operable
- All functionality available via keyboard
- No keyboard traps
- Sufficient time for user interaction
- No content that flashes more than 3 times per second
- Skip navigation links for repeated content

### 3. Understandable
- Page language is set (`lang="en"`)
- Labels and instructions are clear
- Error messages are descriptive and helpful
- Navigation is consistent across pages

### 4. Robust
- Valid HTML
- Compatible with assistive technologies
- ARIA used correctly (or not at all — native HTML is preferred)

## Semantic HTML

### Use Native Elements First
```
✅ <button>        instead of  ❌ <div onClick>
✅ <a href>         instead of  ❌ <span onClick>
✅ <nav>            instead of  ❌ <div class="nav">
✅ <main>           instead of  ❌ <div class="main">
✅ <header>/<footer> instead of ❌ <div class="header">
✅ <section>        instead of  ❌ <div class="section">
✅ <h1>-<h6>        instead of  ❌ <div class="title">
```

### Heading Hierarchy
- One `<h1>` per page
- No skipped levels (h1 → h3 without h2)
- Headings reflect document structure

## ARIA Patterns

### Rules of ARIA
1. If you can use native HTML, use it
2. Don't change native semantics unnecessarily
3. All interactive ARIA elements must be keyboard accessible
4. Don't use `role="presentation"` or `aria-hidden="true"` on focusable elements
5. All interactive elements must have accessible names

### Common Patterns
| Pattern | ARIA | Native Alternative |
|---------|------|--------------------|
| Toggle | `aria-expanded`, `aria-controls` | `<details>/<summary>` |
| Modal | `role="dialog"`, `aria-modal="true"` | `<dialog>` |
| Tab Panel | `role="tablist/tab/tabpanel"` | None — ARIA required |
| Menu | `role="menu/menuitem"` | `<nav>` with links |
| Live Region | `aria-live="polite/assertive"` | None — ARIA required |

## Keyboard Navigation

### Required
- Tab order follows visual order
- Focus indicator visible on all interactive elements
- Escape closes modals/dropdowns
- Enter/Space activates buttons and links
- Arrow keys navigate within composite widgets (tabs, menus)

### Focus Management
- Move focus into modal when opened
- Return focus to trigger when modal closes
- Trap focus within modal while open
- Don't move focus unexpectedly

### Focus Indicator Styling
```css
/* Never remove focus outlines without replacement */
:focus-visible {
  outline: 2px solid var(--orange);
  outline-offset: 2px;
}
```

## Color & Contrast

### Minimum Ratios (WCAG AA)
- Normal text (< 18px): **4.5:1**
- Large text (≥ 18px bold or ≥ 24px): **3:1**
- UI components and graphical objects: **3:1**

### Testing Tools
- Chrome DevTools → Rendering → CSS Overview
- axe DevTools browser extension
- WebAIM Contrast Checker

## Motion & Animation

### Respect User Preferences
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Rules
- Don't auto-play animations that last > 5 seconds
- Provide pause/stop controls for moving content
- No content that flashes more than 3 times/second

## Forms

- Every input has a visible `<label>` (or `aria-label`)
- Required fields marked with `aria-required="true"`
- Error messages associated with inputs via `aria-describedby`
- Group related inputs with `<fieldset>` and `<legend>`
- Submit buttons clearly labeled

## Images

- Decorative images: `alt=""` or CSS background
- Informative images: descriptive `alt` text
- Complex images: `alt` + longer description via `aria-describedby`
- Icon buttons: `aria-label` on the button, `aria-hidden="true"` on the icon

## Checklist

- [ ] Page has one `<h1>`, heading hierarchy is correct
- [ ] All images have appropriate alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast meets WCAG AA minimums
- [ ] ARIA used correctly (or native HTML preferred)
- [ ] `prefers-reduced-motion` respected
- [ ] Forms have associated labels
- [ ] Error messages are descriptive
- [ ] `lang` attribute set on `<html>`
