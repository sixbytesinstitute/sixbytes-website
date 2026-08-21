---
name: responsive-design
description: "Mobile-first responsive design, breakpoint strategy, fluid typography, flexible layouts, touch targets, viewport testing, and responsive images. Use when building or fixing layouts for multiple screen sizes."
---

# Responsive Design

## When to Load
- Building new page layouts
- Fixing layout issues on specific screen sizes
- Implementing mobile navigation
- Optimizing images for different viewports
- Testing across devices

## Mobile-First Approach

### Principle
Write CSS for mobile first, then add complexity for larger screens.

```css
/* Base styles = mobile */
.container { padding: 1rem; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 2rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { padding: 3rem; max-width: 1200px; margin: 0 auto; }
}
```

### Why Mobile-First
1. Forces you to prioritize content
2. Mobile styles are simpler — less to override
3. Progressive enhancement is more robust than graceful degradation
4. Majority of local traffic (India) is mobile

## Breakpoint Strategy

### Standard Breakpoints
| Name | Width | Tailwind | Use Case |
|------|-------|----------|----------|
| Mobile | < 640px | default | Phones (portrait) |
| Small | 640px | `sm:` | Phones (landscape) |
| Medium | 768px | `md:` | Tablets |
| Large | 1024px | `lg:` | Small laptops |
| XL | 1280px | `xl:` | Desktops |
| 2XL | 1536px | `2xl:` | Large screens |

### Testing Widths
Always test at these exact widths:
- **375px** — iPhone SE/small phones
- **390px** — iPhone 14/15
- **768px** — iPad portrait
- **1024px** — iPad landscape / small laptop
- **1440px** — Desktop

## Layout Patterns

### Flexible Grid
```css
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;          /* Mobile: stack */
}
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }  /* Tablet: 2 cols */
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }  /* Desktop: 3 cols */
}
```

### Container Queries (Modern)
```css
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
```

## Fluid Typography

### Clamp for Responsive Font Sizes
```css
h1 { font-size: clamp(2rem, 5vw, 4rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
p  { font-size: clamp(1rem, 1.5vw, 1.125rem); }
```

### Rules
- Minimum font size: 16px for body text
- Don't use `vw` units alone — always use `clamp()` with min/max
- Line length: 45-75 characters per line for readability

## Touch Targets

### Minimum Sizes
- **48px × 48px** minimum for touch targets (buttons, links, form inputs)
- **8px** minimum spacing between touch targets
- Increase padding rather than changing font size

### Mobile Navigation
- Hamburger menu icon: ≥ 44px × 44px
- Menu items: ≥ 48px height with full-width tap area
- Close button: clearly visible, ≥ 44px × 44px

## Responsive Images

### Techniques
1. **CSS**: `max-width: 100%; height: auto;`
2. **Next.js Image**: Use `<Image>` with `sizes` prop
3. **Art Direction**: Different crops for different screens

### Performance
- Use WebP/AVIF formats
- Provide appropriate `sizes` attribute
- Lazy load below-fold images
- Set explicit width/height to prevent layout shift

## Common Anti-Patterns

| Anti-Pattern | Fix |
|---|---|
| Fixed widths in pixels | Use `%`, `vw`, `max-width`, `min-width` |
| Horizontal scroll on mobile | Check overflow, use `overflow-x: hidden` on body |
| Tiny tap targets | Increase padding to minimum 48px |
| Desktop-only hover effects | Use `@media (hover: hover)` |
| Text too small on mobile | Use `clamp()` with 16px minimum |
| Images overflow container | Add `max-width: 100%` |
| Fixed position elements blocking content | Test with virtual keyboard open |

## Testing Checklist

- [ ] Renders correctly at 375px (mobile)
- [ ] Renders correctly at 768px (tablet)
- [ ] Renders correctly at 1440px (desktop)
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets ≥ 48px on mobile
- [ ] Text readable without zooming on mobile
- [ ] Images scale proportionally
- [ ] Navigation works on all screen sizes
- [ ] Forms usable on mobile (with virtual keyboard)
- [ ] No content hidden or cut off at any breakpoint
