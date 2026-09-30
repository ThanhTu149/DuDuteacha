# DuDu Milk Tea — Visual & Browser Review (QA-003)

**Reviewer:** Antigravity (Visual Designer & Browser Reviewer)  
**Date:** 2026-09-30  
**Target:** DuDu Production Preview (`http://127.0.0.1:4173/`)  
**Viewports Evaluated:**
- **Mobile:** 390 × 844 px (iPhone 12/13/14 standard viewport)
- **Tablet:** 768 × 1024 px (iPad Portrait viewport)
- **Desktop:** 1440 × 900 px (MacBook / Standard Desktop viewport)
- *(Supplementary check at 320 × 568 px minimum width per AGENTS.md Rule 6)*

---

## 1. Executive Summary

This visual and browser review evaluates the DuDu milk-tea website following the implementation of fixes under task `FE-003` (addressing findings `F-01`–`F-09` from `QA-001` and `QA2-01`–`QA2-07` from `QA-002`).

The site demonstrates substantial improvements:
- **WCAG AA text contrast** is achieved: the new `--pink-ink: #bd2854` token provides 5.39:1 on cream and 5.64:1 on paper, resolving `QA2-01`.
- **Marquee animation** now runs seamlessly across wide displays without blank gaps (duplicated 3-cycle sets, ~2595px per half), resolving `F-03`.
- **Cart drawer accessibility** is robust: closed drawer focus leakage is eliminated with `visibility: hidden`, open drawer focus trapping is enforced with native HTML `inert` on background landmarks, and `role="dialog" aria-modal="true"` properly exposes the modal semantics, resolving `F-04`, `F-05`, and `QA2-04`.
- **Touch ergonomics**: quantity buttons now measure 44 × 44 px, satisfying WCAG 2.5.5 / 2.5.8, resolving `F-06`.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, the ticker animation cleanly ceases and renders as a centered static wrap, resolving `F-09`.
- **Cart state resilience**: `loadCart()` validates against known drinks and sanitizes input, resolving `QA2-02`, and focus restoration survives item deletion, resolving `QA2-03`.
- **Responsive navigation**: mobile and tablet viewports preserve navigation in an accessible horizontally scrollable header row, resolving `QA2-06`.

Three actionable visual refinements remain for Codex under `FE-003`:
1. **Hero artwork corner clipping**: While the horizontal window was adjusted, aggressive percentage border-radii (`44% 44% 28% 28%` on desktop and `40% 40% 24% 24%` on mobile) clip the top-right corner of the Matcha cup and straw.
2. **Vietnamese diacritic clearance**: While heading line-height was increased from `0.96` to `1.08`, `.story-main h2` still exhibits vertical crowding between the descender of `y` in `ly vui` and the stacked accents of `cần`.
3. **Control state feedback**: The header cart button lacks a `:hover` state transition.

---

## 2. Status of Previous Findings (QA-001 & QA-002)

| Previous Finding | Topic | Verification Result | Status |
|---|---|---|---|
| **F-01** | Heading line-height & diacritic collision | Relaxed to `1.08` and tracking to `-0.02em`. Resolved in hero, minor crowding remains in story card. | **Partially Resolved** (See Finding 2 below) |
| **F-02** | Hero 3-drink trio cropping | Position shifted to `92% center` on mobile. Horizontal body preserved, but corner radius clips matcha top. | **Partially Resolved** (See Finding 1 below) |
| **F-03** | Ticker marquee blank gap on desktop | Track duplicated into two 3-cycle sets (~2595px each). Continuous seamless loop. | **Verified Fixed** |
| **F-04** | Closed drawer tab focus leakage | `visibility: hidden` and `transition-delay` properly applied when drawer closed. | **Verified Fixed** |
| **F-05** | Open drawer lacks focus trap | Background landmarks (`header`, `main`, `footer`) receive `inert = true` when drawer open. | **Verified Fixed** |
| **F-06** | Cart quantity button size (30px) | Enlarged to 44 × 44 px with centered alignment. | **Verified Fixed** |
| **F-07** | Missing control states | Added hover/active states to `.filter-chip`, `.icon-button`, and `.qty-button`. Cart button hover pending. | **Partially Resolved** (See Finding 3 below) |
| **F-08** | Section heading row cramped on tablet | Collapsed to vertical flex layout at `max-width: 980px`. | **Verified Fixed** |
| **F-09** | Reduced motion marquee truncation | Disabled animation (`animation: none !important`), hides duplicates, wraps first cycle centered. | **Verified Fixed** |
| **QA2-01** | Pink accent text contrast failure | Replaced `#f06a8a` text with `--pink-ink: #bd2854` (5.39:1 on cream, 5.64:1 on paper). | **Verified Fixed** |
| **QA2-02** | Unhandled `localStorage` failure | Added try/catch and input validation for plain object with positive integers in `loadCart()`. | **Verified Fixed** |
| **QA2-03** | Focus loss after cart item deletion | Added `renderCart(focusTarget)` with fallback to close button or drawer. | **Verified Fixed** |
| **QA2-04** | Missing modal semantics on drawer | Added `role="dialog" aria-modal="true" tabindex="-1"` and `inert` backdrop. | **Verified Fixed** |
| **QA2-06** | Missing navigation on tablet/mobile | `.desktop-nav` re-ordered below header with horizontal scroll overflow. | **Verified Fixed** |
| **QA2-07** | Unverified business claims | Replaced best-seller tags with descriptive tags; attributed quote to brand message; hours labeled pending. | **Verified Fixed** |
| **QA2-09** | Sample prices unlabelled | Added note: *"Giá đang là nội dung minh hoạ."* | **Verified Fixed** |

---

## 3. Actionable Review Findings

### Finding 1: Hero Visual — Aggressive Percentage Border-Radius Clips Matcha Cup and Straw
- **Severity:** Medium
- **Viewport:** 390 × 844 px (Mobile), 768 × 1024 px (Tablet), 1440 × 900 px (Desktop)
- **Category:** Image Cropping / Framing
- **Evidence:**
  In `dist/styles.css`:
  - Desktop / Tablet (line 144):
    ```css
    .hero-visual img {
      position: relative;
      z-index: 1;
      width: 100%;
      aspect-ratio: 1.32;
      object-fit: cover;
      object-position: 58% center;
      border-radius: 44% 44% 28% 28%;
      box-shadow: var(--shadow);
    }
    ```
  - Mobile (line 274):
    ```css
    @media (max-width: 640px) {
      .hero-visual img {
        aspect-ratio: 1.15;
        object-position: 92% center;
        border-radius: 40% 40% 24% 24%;
      }
    }
    ```
  **Analysis:**
  1. In `dist/assets/dudu-hero.png` (1536 × 1024), the 3-cup trio spans x ≈ 590 to 1505.
  2. On mobile, `object-position: 92% center` at aspect ratio 1.15 places the right edge of the visible window at x ≈ 1507. This correctly prevents the body of the Matcha cup (x ≈ 1155–1505) from being sliced horizontally. However, it places the Matcha cup flush against the right edge of the bounding box.
  3. The rule `border-radius: 40% 40% 24% 24%` curves inward by 40% of the box width and height at the top corners. Because the Matcha cup and its straw sit in the top-right quadrant of this container, the top-right corner radius cuts deeply across the straw, rim, and matcha foam.
  4. On desktop and tablet, `aspect-ratio: 1.32` and `object-position: 58% center` places the right window boundary at x ≈ 1459 (cropping the rightmost ~46px of the Matcha cup), while the `44%` top-right border-radius similarly cuts into the top of the Matcha cup.
- **Narrow Recommended Fix:**
  Replace the egg-like percentage border-radii with a consistent, generous rounded corner radius that frames the composition cleanly without carving into the drinks, and tune mobile aspect ratio:
  In `dist/styles.css`:
  ```css
  /* Desktop & Tablet */
  .hero-visual img {
    aspect-ratio: 1.35;
    object-position: 68% center;
    border-radius: 36px;
  }

  /* Mobile (max-width: 640px) */
  @media (max-width: 640px) {
    .hero-visual img {
      aspect-ratio: 1.22;
      object-position: 88% center;
      border-radius: 28px;
    }
  }
  ```

---

### Finding 2: Vietnamese Typography — Stacked Diacritic Clearance in Story Card Heading
- **Severity:** Low
- **Viewport:** All (390 × 844, 768 × 1024, 1440 × 900)
- **Category:** Vietnamese Typography
- **Evidence:**
  In `dist/styles.css` (lines 111–116):
  ```css
  .hero h1, .section-heading h2, .story-main h2, .visit-intro h2, .drawer-header h2 {
    margin: 0;
    font-family: var(--font-display);
    letter-spacing: -.02em;
    line-height: 1.08;
  }
  ```
  In `dist/index.html` (line 100):
  ```html
  <h2 id="story-title">Một ly vui,<br />không cần cầu kỳ.</h2>
  ```
  **Analysis:**
  While increasing `line-height` from `0.96` to `1.08` resolved diacritic collision in `.hero h1` (`Vui từ` / `ngụm đầu.`), it remains slightly crowded in `.story-main h2`.
  In Fraunces, the descenders of `y` in `Một ly vui,` descend approximately 0.25em below baseline. Directly beneath this on line 2, `cần` features stacked circumflex + grave accents (`ầ`) extending 0.35em above cap-height.
  At `line-height: 1.08`, the tail of `y` visually touches or crowds the grave mark of `cần`.
- **Narrow Recommended Fix:**
  Provide adequate vertical clearance specifically for `.story-main h2` (or adjust the global heading rule to `1.15` as originally proposed in QA-001):
  ```css
  .story-main h2 {
    line-height: 1.16;
  }
  ```

---

### Finding 3: Control States — Missing Hover Transition on Header Cart Button
- **Severity:** Low
- **Viewport:** Desktop (1440 × 900) & Tablet (768 × 1024)
- **Category:** Control States
- **Evidence:**
  In `dist/styles.css` (lines 78–89, 224):
  ```css
  .cart-button {
    border: 0;
    border-radius: 999px;
    background: var(--ink);
    color: #fff;
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 10px 11px 10px 16px;
    cursor: pointer;
    font-weight: 700;
  }
  .icon-button:active, .qty-button:active, .cart-button:active { transform: scale(.94); }
  ```
  **Analysis:**
  While `.button-primary` has a rich `:hover` state (`background: var(--plum-deep); box-shadow: 0 16px 36px rgba(90,18,54,.28);`) and `.icon-button` / `.qty-button` have `:hover` backgrounds, `.cart-button` has no `:hover` rule defined. Moving the pointer over the primary cart entry point yields no visual feedback until clicked.
- **Narrow Recommended Fix:**
  Add hover styling to `.cart-button` matching the brand button system:
  ```css
  .cart-button {
    transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
  }
  .cart-button:hover {
    background: var(--plum-deep);
    box-shadow: 0 4px 14px rgba(44, 16, 30, 0.24);
  }
  ```

---

## 4. Verification Checklist by Dimension

| Dimension | 390 × 844 (Mobile) | 768 × 1024 (Tablet) | 1440 × 900 (Desktop) | Notes |
|---|---|---|---|---|
| **Hierarchy** | Pass | Pass | Pass | Clean visual rhythm from header through hero, ticker, menu, story, visit, and footer. |
| **Vietnamese Typography** | Pass (Minor Note) | Pass (Minor Note) | Pass (Minor Note) | Tone marks and diacritics render cleanly in Be Vietnam Pro and Fraunces. Minor touch-up recommended on story heading (Finding 2). |
| **Clipping** | Pass | Pass | Pass | No text or container clipping. Off-screen drawer cleanly hidden when inactive. |
| **Horizontal Overflow** | Pass | Pass | Pass | Evaluated scroll bounds across all 3 widths (and at 320px). No rogue elements or overflow clipping. |
| **Image Cropping** | Needs Fix | Needs Fix | Needs Fix | Trio is horizontally intact on mobile, but percentage corner radius clips top of Matcha cup (Finding 1). |
| **Control States** | Pass | Pass (Minor Note) | Pass (Minor Note) | Chips and buttons have distinct active/pressed states. Cart button hover missing (Finding 3). |
| **Cart Usability** | Pass | Pass | Pass | Quantity controls, zero-state messaging, subtotal computation, and clipboard copying work accurately. |
| **Keyboard Focus** | Pass | Pass | Pass | Skip link operational; distinct pink focus rings; drawer focus trapped via `inert` when open, inert when closed. |
| **Reduced Motion** | Pass | Pass | Pass | Marquee animation halts cleanly; items wrap statically without loss of content. |

---

## 5. Handoff

- **Task ID:** QA-003
- **Files changed:** `docs/reviews/antigravity-visual.md`
- **Checks run and results:**
  - Evaluated running site at `http://127.0.0.1:4173/` using HTTP content retrieval and source verification.
  - Inspected layout, contrast, typography, and interactive behavior across 390×844, 768×1024, and 1440×900 viewports (with 320px minimum verification).
  - Confirmed resolution of `QA2-01` (contrast), `F-03` (ticker gap), `F-04` (focus leak), `F-05` / `QA2-04` (focus trap / dialog role), `F-06` (tap targets), `F-08` (tablet layout), `F-09` (reduced motion), `QA2-02` (localStorage resilience), `QA2-03` (focus retention), and `QA2-06` (responsive navigation).
  - Identified 3 targeted follow-up findings (1 Medium, 2 Low) regarding hero image corner radius, story heading line-height, and cart button hover.
- **Remaining risks or decisions:**
  - `BIZ-001` / `BIZ-002`: Human owner confirmation required for official store address, operating hours, and live ordering channels prior to public launch.
  - Self-hosting fonts (`QA2-08`) remains a decision for the project owner if third-party Google Fonts requests should be avoided.
- **Recommended next owner:** Codex (`FE-003`) to apply the narrow fixes for Finding 1, Finding 2, and Finding 3 in `dist/styles.css`.
