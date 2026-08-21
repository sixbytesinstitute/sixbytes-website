# DESIGN.md — Visual Design System & Specification
## SixBytes Educational Institute

**Last Updated:** 2026-08-19  
**Theme:** Premium Obsidian Dark with Electric Orange Accents

---

## 1. Design Philosophy & Aesthetic Identity

SixBytes Educational Institute’s visual identity balances academic authority with a modern, high-tech aesthetic. It avoids generic flat-white academic templates in favor of a deep, focused obsidian canvas illuminated by warm orange gradients, subtle glassmorphism surfaces, and smooth micro-animations.

- **Primary Canvas**: Deep Obsidian (`#0a0c0e`) and Midnight Navy (`#0f1318`)
- **Primary Energy**: Radiant Orange (`#F97316` to `#FB923C`)
- **Typography Tone**: Prestigious Serif Headings (Playfair Display) + Readable Modern Sans-Serif Body (DM Sans)
- **Surfaces**: Frosted glass panels with subtle border glows (`rgba(255, 255, 255, 0.08)`)

---

## 2. Color System & Design Tokens

### Core Color Palette
| Token Name | Hex / CSS Value | Description & Primary Usage |
|---|---|---|
| `--color-obsidian` | `#0a0c0e` | Default page background, lowest elevation surface |
| `--color-navy` | `#0f1318` | Alternate section background for visual rhythm |
| `--color-navy-mid` | `#141a1f` | Card surfaces, container backgrounds |
| `--color-orange` | `#F97316` | Primary brand accent, primary CTA buttons, highlighted words |
| `--color-orange-light` | `#FB923C` | Hover states, gradient accents, glowing halos |
| `--color-orange-dim` | `rgba(249, 115, 22, 0.12)` | Subtle pill tags, icon container backdrops |
| `--color-cream` | `#F7F3EC` | Primary body and heading text color (soft white) |
| `--color-text-muted` | `rgba(247, 243, 236, 0.60)` | Secondary metadata, subtitles, descriptions |
| `--color-glass-border` | `rgba(255, 255, 255, 0.08)` | Card borders, dividers, subtle separators |

### Gradients
```css
/* Primary Brand Gradient */
--gradient-orange: linear-gradient(135deg, #F97316 0%, #FB923C 100%);

/* Dark Surface Gradient */
--gradient-surface: linear-gradient(180deg, rgba(20, 26, 31, 0.8) 0%, rgba(15, 19, 24, 0.95) 100%);

/* Radial Glow Gradient */
--gradient-glow: radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(10, 12, 14, 0) 70%);
```

---

## 3. Typography Scale

### Font Families
- **Headings & Display**: `'Playfair Display', Georgia, serif` (Weights: 700, 800, 900)
- **Accent Serifs & Subtitles**: `'Cormorant Garamond', Georgia, serif` (Weights: 400, 600, italic)
- **Body, UI & Navigation**: `'DM Sans', system-ui, -apple-system, sans-serif` (Weights: 400, 500, 700)

### Type Hierarchy
| Level | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---|---|---|---|---|---|
| **Hero Title (H1)** | Playfair Display | `clamp(2.5rem, 5vw, 4.5rem)` | `2.25rem` | 800 | 1.1 |
| **Section Heading (H2)** | Playfair Display | `clamp(2rem, 3.5vw, 3rem)` | `1.875rem` | 700 | 1.2 |
| **Card Title (H3)** | Playfair Display | `1.5rem` (24px) | `1.25rem` (20px) | 700 | 1.3 |
| **Feature Title (H4)** | DM Sans | `1.125rem` (18px) | `1rem` (16px) | 600 | 1.4 |
| **Body (Regular)** | DM Sans | `1rem` (16px) | `0.9375rem` (15px) | 400 | 1.6 |
| **Small / Caption** | DM Sans | `0.875rem` (14px) | `0.8125rem` (13px) | 500 | 1.5 |
| **Section Tag Pill** | DM Sans | `0.75rem` (12px) | `0.75rem` (12px) | 700 (Uppercase) | 1.0 |

---

## 4. Components & Surface Specifications

### Glassmorphism Card (`.glass-card`)
```css
.glass-card {
  background: rgba(20, 26, 31, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  border-color: rgba(249, 115, 22, 0.4);
  box-shadow: 0 12px 40px 0 rgba(249, 115, 22, 0.15);
}
```

### Primary Action Button (`.btn-orange`)
```css
.btn-orange {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  background: var(--gradient-orange);
  color: #ffffff;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.35);
}

.btn-orange:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
}
```

### Outline Action Button (`.btn-outline`)
```css
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  background: transparent;
  color: var(--color-cream);
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  border-color: var(--color-orange);
  color: var(--color-orange);
  background: rgba(249, 115, 22, 0.08);
}
```

---

## 5. Micro-Animations & Motion Design

| Animation | Duration | Easing | Usage |
|---|---|---|---|
| `fadeUp` (Scroll Reveal) | `0.7s` | `cubic-bezier(0.16, 1, 0.3, 1)` | Section content appearing on viewport entry |
| `floatY` | `6s` | `ease-in-out` (Infinite) | Floating stat badge badges in hero section |
| `glowPulse` | `4s` | `ease-in-out` (Infinite) | Radial background glows behind key visual assets |
| `spinSlow` | `25s` | `linear` (Infinite) | Decorative geometric orbit rings in hero |
| `shimmerLine` | `3s` | `ease-in-out` (Infinite) | Orange gradient horizontal separator bars |

---

## 6. Accessibility & Responsiveness Requirements

- **Contrast Validation**: All body text on obsidian/navy backgrounds must meet WCAG AA minimum (≥ 4.5:1 ratio).
- **Interactive Focus Indicator**: `:focus-visible` must display a 2px solid orange outline with 2px offset.
- **Motion Safety**: Respect `@media (prefers-reduced-motion: reduce)` by disabling all ambient loops and scroll transitions.
- **Touch Friendly**: All clickable buttons and navigation links must provide a touch target of at least 48px × 48px.
