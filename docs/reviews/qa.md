# DuDu Milk Tea — Requirements & Regression Review (QA-002)

**Reviewer:** DeepSeek Harness (Coordinator & QA)
**Date:** not recorded — no shell clock available in this session (see §1)
**Target:** `dist/index.html`, `dist/styles.css`, `dist/app.js`, `dist/assets/dudu-hero.png`
**Method:** full source read; independent recomputation of contrast, crop geometry, and marquee width; cross-check of every QA-001 claim against the actual files.
**Not changed by this review:** nothing under `dist/` was modified.

---

## 1. Verification limitation (read this first)

> **Codex follow-up:** this limitation applied only to the DeepSeek Harness headless sandbox. The
> parent Codex session can run project commands and has taken over runtime verification under
> FE-003. `ENV-001` is therefore resolved; the analysis below remains the DeepSeek static-review
> record rather than the final verification result.

The sandbox shell could not start in this session. Every `pwsh` invocation fails before running:

```
SetNamedSecurityInfoW failed (Win32 5): grantWrite(C:\DuDu 奶茶\dudu-milktea)
```

DSH cannot provision its workspace permission grant on the workspace root, so **no process can be launched** — no HTTP server, no headless browser, no Node/`npx`. The one-shot repair script was identified and attempted, but the escalation was refused automatically:

```
sandbox escalation to "danger-full-access" requires approval, but no approval channel is available
```

**Consequence:** the runtime half of the `docs/architecture.md` checklist (steps 1–7) is **not executed**.

### What this review therefore is

| Class | Status |
|---|---|
| Source-level facts (code, tokens, geometry, contrast math) | **Verified** — deterministic, recomputed here |
| Rendering behaviour (filters, cart math, persistence, clipboard, Escape, focus return) | **Not verified** — statically plausible, needs a browser |
| Layout overflow at 320/390/768/1024/1440px | **Not verified** — see QA2-05, `overflow-x: hidden` makes eyeballing insufficient |

Everything below is labelled with which class it belongs to. No runtime result is claimed.

---

## 2. Verdict on QA-001 (`antigravity-visual.md`)

All nine findings were checked line by line against the files. **All nine describe real code**, and eight of nine describe real defects. Two contain factually incorrect evidence that would misdirect the fix.

| ID | QA-001 claim | QA-002 verdict |
|---|---|---|
| F-01 | Heading `line-height: .96`, `letter-spacing: -.055em` | **Confirmed** (`styles.css:110–115`). Impact refined — see §3. |
| F-02 | Mobile hero crops the leftmost drink | **Crop confirmed, subject wrong.** The *matcha* cup is cropped, not Đường Đen. Proposed fix does not fix it — see §4.1. |
| F-03 | Ticker half-track narrower than desktop viewport | **Confirmed** (`index.html:66–67`, `styles.css:150–152`) |
| F-04 | Closed drawer leaks tab focus | **Confirmed** (`styles.css:211`, `index.html:150`) |
| F-05 | Open drawer has no focus trap | **Confirmed** (`app.js:77–88`) |
| F-06 | 30px quantity buttons | **Confirmed** (`styles.css:222`). Severity overstated — see §4.2. |
| F-07 | Missing hover/active states | **Confirmed** (`styles.css:77, 159, 216, 222`) |
| F-08 | `.section-heading` stays a flex row at 641–980px | **Confirmed** (`styles.css:155`, not reset in the 980px block) |
| F-09 | Reduced-motion marquee freezes at `-50%` | **Concern confirmed, mechanism wrong** — see §4.3. |

**Coverage gap:** QA-001 states it evaluated 390 / 768 / 1440. It never evaluated **320px**, which is the explicit minimum in `AGENTS.md` rule 6, in the acceptance criteria, and in `docs/architecture.md` step 2. The 390px result does not transfer to 320px. Logged as **QA-003**.

---

## 3. Confirmed findings (accepted, with severity adjustments)

These are accepted for FE-003 as written in `antigravity-visual.md`. Only the two notes below change the fix.

- **F-01 (High — accepted).** Code fact confirmed. One correction to the *mechanism*: `.hero { overflow: hidden }` (`styles.css:105`) is unlikely to clip the `h1`, because the heading sits inside `.hero-copy` within `clamp(42px, 7vw, 96px)` of padding. The realistic failure is **line-to-line collision** of Vietnamese stacked diacritics against the descender of the line above, not box clipping. The recommended fix (`line-height: 1.15`, `letter-spacing: -0.02em`) treats both and is accepted.
- **F-06 (Low, not Medium — accepted).** 30×30px passes WCAG 2.5.8 (AA, 24×24 minimum). It fails only 2.5.5, which is **AAA**. It is still a worthwhile ergonomic fix, but it must not be triaged alongside the genuine AA failures in §5. Note `.icon-button` is already 44×44 and `.add-button` 42×42, so the drawer is the only outlier.

---

## 4. Corrections required before FE-003 implements

### 4.1 F-02 — the cropped drink is the matcha, not the đường đen

**Class: verified (geometry).** `dist/assets/dudu-hero.png` is **1536×1024** (1.5:1), confirmed from the image itself and matching the `width`/`height` attributes in `index.html:56`. In the artwork the three cups occupy roughly **x ≈ 590–1505**; everything left of x ≈ 380 is empty plum background.

Mobile rule (`styles.css:259`) is `aspect-ratio: .96; object-position: 60% center` with `object-fit: cover`. Because `.96 < 1.5`, the image scales to fill height:

- visible width = 1024 × .96 = **983px of 1536 → 36% cropped** (QA-001's percentage is correct)
- horizontal overflow = 1536 − 983 = 553px
- left crop = .60 × 553 = **332px**; visible window ≈ **x 332 → 1315**

So the window opens at x≈332, which is *left of the first cup* (x≈590) and closes at x≈1315, which is *inside the matcha cup* (x≈1155–1505). The **đường đen cup is fully in frame**; the **matcha cup loses roughly half its width**.

QA-001's proposed fix (`aspect-ratio: 1.28; object-position: center`) gives a window of x ≈ 113 → 1423 — it still clips the matcha by ~80px while adding dead background on the left. **It does not resolve the defect.**

The base desktop rule (`styles.css:143`, `aspect-ratio: 1.32`, `object-position: 58%`) yields x ≈ 107 → 1459, clipping the matcha's right edge by ~46px — a milder version of the same problem, which is why the desktop check passed.

**Narrow suggested fix for FE-003** — choose one, do not guess:
1. Keep `aspect-ratio: .96` and move the window right so the trio is framed, e.g. `object-position: 97% center`; or
2. Prefer the robust option: regenerate/recrop `dudu-hero.png` with the trio centred and ~15% padding, then `object-position: center` works at every aspect ratio.

Option 1 must be checked against the `border-radius: 40% 40% 24% 24%` (`styles.css:259`) — a tightly right-shifted window puts the đường đen cup under the rounded corner. This is a visual judgement, so **Antigravity should confirm the chosen value after FE-003**, which is why QA-003 exists.

### 4.2 F-09 — the marquee does not freeze at `-50%`

**Class: verified (CSS semantics).** The shorthand `animation: marquee 24s linear infinite` (`styles.css:150`) leaves `animation-fill-mode` at its initial value `none`. With `animation-duration: .01ms !important; animation-iteration-count: 1 !important` (`styles.css:236`), the animation completes and, having no forwards fill, **reverts to the un-animated state — `transform: none`, i.e. `translateX(0)`**. It does not sit at `-50%`.

The *user-visible problem is still real and still worth fixing*: with `overflow: hidden` on `.ticker` and no motion, only the leftmost ~390px of a ~920px track is readable and the remainder is unreachable. So keep the finding, but the evidence line in `antigravity-visual.md` should be corrected so Codex is not fixing a non-existent freeze.

**Narrow suggested fix** — QA-001's remedy is fine and does not depend on the wrong mechanism:
```css
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none !important; flex-wrap: wrap; justify-content: center; }
}
```

### 4.3 F-03 — arithmetic independently reproduced

Half-track ≈ 4 phrases + 4 stars + 7 gaps × 28px ≈ **865–920px**, against a 1440px viewport → blank strip of roughly **520–575px**. Confirmed. Duplicating the sequence to 3–4 repetitions per half is the right fix.

---

## 5. New findings (QA-002)

### QA2-01 — Pink accent text fails WCAG AA contrast
**Severity:** High · **Viewport:** all · **Class:** verified (computed)

Recomputed with the WCAG 2.1 relative-luminance formula from the token hex values in `styles.css:1–17`:

| Element | Foreground | Background | Ratio | Required | Result |
|---|---|---|---|---|---|
| `.hero h1 em` — "ngụm đầu." (`styles.css:117`) | pink `#f06a8a` | cream `#fff5df` | **2.72:1** | 3.0:1 (large display text) | **Fail** |
| `.visit-details article > span` — the 01/02/03 markers (`styles.css:201`) | pink `#f06a8a` | paper `#fffaf0` | **2.83:1** | 4.5:1 (16px bold is not "large") | **Fail** |

Everything else checked passes: `--muted` on paper 6.0:1, `--plum` on cream 12.3:1, `.story-quote` 5.9:1, `footer p` 7.2:1, `.filter-chip.is-active` 13.8:1, and all six menu-card tones 4.8–5.3:1.

This directly contradicts the REQUIREMENTS line "readable contrast", and the failing hero element is the brand's signature pink accent.

**Narrow suggested fix:** darken the pink used for *text* only, keeping `#f06a8a` for backgrounds and decorative fills. e.g. introduce `--pink-ink: #c2355c` (~5.0:1 on cream) and apply it to `.hero h1 em` and `.visit-details article > span`. Do not change `--pink` itself — it is correct as a surface colour (`.story-quote` background at 5.9:1 with plum-deep text).

### QA2-02 — Corrupt or blocked `localStorage` blanks the entire menu
**Severity:** Medium · **Viewport:** all · **Class:** verified (code path)

`app.js:20` runs at top level, before any rendering:
```js
let cart = JSON.parse(localStorage.getItem("dudu-cart") || "{}");
```
If the stored value is not valid JSON (truncated write, manual edit, another app on the same origin), `JSON.parse` throws and the whole script aborts — `renderMenu()` at `app.js:135` never runs, so the menu grid is permanently empty. The same happens if the `localStorage` getter itself throws (storage disabled by policy). There is no `try`/`catch` anywhere in `app.js`. Also, `cartEntries()` (`app.js:45`) filters unknown ids out of the *display* while `saveCart()` (`app.js:41`) writes the raw object back, so invalid keys persist forever.

**Narrow suggested fix:** wrap the read in `try`/`catch` falling back to `{}`, and validate the parsed value is a plain object with numeric values before use. Additionally wrap `saveCart()`'s `setItem` in `try`/`catch` so a storage failure cannot break rendering.

### QA2-03 — Cart re-render destroys the focused button
**Severity:** Medium · **Viewport:** keyboard, all · **Class:** verified (code path)

`app.js:97–104`: increase/decrease mutate state then call `renderCart()`, which replaces `cartItems.innerHTML` (`app.js:57`). The button the user just activated is discarded, so focus falls back to `<body>`. A keyboard-only shopper adjusting a quantity loses their place after every single press — and after `decrease` removes the last unit, the control they were on no longer exists.

Related: `closeCart()` (`app.js:84–88`) restores `lastFocused`, but if that node was a quantity button destroyed by a re-render, `.focus()` silently does nothing.

**Narrow suggested fix:** after re-render, restore focus to the equivalent control (match on `data-increase`/`data-decrease` id), falling back to the drawer container; and in `closeCart()` guard with `lastFocused?.isConnected`.

### QA2-04 — Drawer is not exposed as a modal dialog
**Severity:** Medium · **Viewport:** all · **Class:** verified (markup)

`index.html:150` is `<aside class="cart-drawer" aria-labelledby="cart-title" aria-hidden="true">`. It behaves modally (backdrop, `body.drawer-open { overflow: hidden }`) but is not announced as a dialog, has no `aria-modal`, and the background content is never made `inert`. This is the semantic half of F-05; fixing the focus trap alone leaves screen-reader users able to wander the obscured page.

**Narrow suggested fix:** add `role="dialog" aria-modal="true"` to the drawer, and toggle the `inert` attribute on `header`, `main`, and `footer` in `openCart()`/`closeCart()`. `inert` also resolves F-04 and F-05 in one mechanism, and is preferable to a hand-rolled key trap.

### QA2-05 — `overflow-x: hidden` makes the acceptance criterion unprovable
**Severity:** Medium · **Viewport:** 320 / 768 / 1440 · **Class:** process

`styles.css:30` sets `overflow-x: hidden` on `body`. Any element that overflows is therefore silently clipped instead of producing a scrollbar. QA-001's checklist records "no document scrollbar blowout" as evidence for "no horizontal overflow" — but that evidence is void, because the scrollbar is suppressed by design either way. Content can be cut off while the check still reads clean.

**Narrow suggested fix (verification, not code):** do not accept absence-of-scrollbar as proof. Measure `document.documentElement.scrollWidth` against `clientWidth` with `overflow-x` temporarily disabled, or assert that no element's `getBoundingClientRect().right` exceeds the viewport. Add this to `docs/architecture.md` step 2.

**Specific 320px risk to check first:** at a 320px viewport the mobile hero rule (`styles.css:254–255`) gives a 252px content box and a `clamp(3.5rem, 17vw, 5rem)` → **56px** heading. "ngụm đầu." at 56px in Fraunces italic is close to that 252px budget. It may fit; it may not. `.hero { overflow: hidden }` would hide the failure as clipped text. **This must be measured at 320px before FE-003 is closed.**

### QA2-06 — Mobile has no navigation at all
**Severity:** Low · **Viewport:** ≤980px · **Class:** verified (code path)

`styles.css:240` sets `.desktop-nav { display: none }` below 980px and nothing replaces it. On every phone and tablet the Story and Visit sections are reachable only by scrolling; the `<nav aria-label="Điều hướng chính">` landmark is removed from the accessibility tree entirely. The hero does link to both sections (`index.html:44–45`), which limits the damage.

**Narrow suggested fix:** keep the nav in the DOM at small sizes as a horizontally scrollable row under the header, or add a compact menu button. Do not simply un-hide `.desktop-nav` — 3 links + brand + cart pill do not fit at 320px.

---

## 6. Requirements & compliance assessment

**Acceptance criteria (`REQUIREMENTS.md`) — statically assessable:**

| Criterion | Assessment |
|---|---|
| No horizontal overflow at 320/768/1440 | **Unproven.** Suppressed by `overflow-x: hidden`; 320px hero heading is a concrete risk (QA2-05) |
| Menu filters update visible products | Logic reads correct (`app.js:109–118`, `22–38`); needs a browser |
| Cart add/increase/decrease, totals, persistence, copy | Logic reads correct (`app.js:90–107`, `48–68`, `120–129`); needs a browser |
| Drawer opens/closes/restores focus/closes on Escape | Escape and restore exist (`app.js:131–133`, `84–88`) but are **defeated** by F-04/F-05/QA2-03 |
| No fake business facts or successful-order messages | **Partially met** — see below |
| Static site loads from `dist/index.html` with local assets | **Partially met** — see below |

**No false order claim — clean.** `index.html:166` labels the cart "Đây là bản đặt món thử", `#copy-order` says "Sao chép đơn hàng", and the copied text (`app.js:122`) ends "Ghi chú: Vui lòng xác nhận giá và kênh nhận đơn." Nothing claims an order was sent. Address and order channel are correctly labelled pending (`index.html:119, 133`). No phone number or social handle is invented.

**QA2-07 — Unverified business claims on the page.** **Severity:** Medium · **Owner:** Human (BIZ-001)
`AGENTS.md` rule 4 forbids inventing business facts. `REQUIREMENTS.md` names address/phone/social/delivery, but these are equally unsupplied and equally unfounded:
- `index.html:126` — opening hours "09:00 – 22:00", presented as fact with no pending label.
- `index.html:97` — "04h" tea-batch claim.
- `index.html:103–104` — the blockquote "Uống một ngụm, mood lên một bậc." attributed to "— Hội bạn DuDu" is a **testimonial attributed to a customer group**. Rule 4 forbids invented reviews; this is at best ambiguous and should be explicitly approved or reworded as unattributed brand voice.
- `app.js:2` — the "Bán chạy" (best-seller) badge is a sales claim with no evidence.

**Narrow suggested fix:** either label hours as pending like the address, or confirm them with the owner under BIZ-001. Reword the blockquote so it is not attributed to people who do not exist. Treat the best-seller badge the same way.

**QA2-08 — Google Fonts is a remote dependency.** **Severity:** Low · **Owner:** Human (decision)
`index.html:9–11` loads Fraunces and Be Vietnam Pro from `fonts.googleapis.com`. The criterion "loads from `dist/index.html` with local assets" is not literally satisfied — the signature typography is remote and the site renders in fallback Georgia/system-ui if offline or blocked (degradation is graceful, so this is not a defect, just a mismatch between the stated criterion and the implementation). It also leaks a third-party request from every visitor.

**Narrow suggested fix:** decide explicitly. Either self-host the two families as `woff2` under `dist/assets/fonts/`, or amend the criterion in `REQUIREMENTS.md` to permit CDN fonts.

**QA2-09 — Sample prices are not labelled as sample.** **Severity:** Low · **Owner:** Human (BIZ-001)
`REQUIREMENTS.md` states menu prices "are sample content and should be confirmed before public launch", but the page presents `45.000₫` etc. as final. Partly mitigated by the cart's demo wording. Recommend a small "giá tham khảo" note near the menu until BIZ-001 confirms.

---

## 7. Handoff

**Task ID:** QA-002 (with PM-001 board validation)

**Files changed:** `docs/reviews/qa.md` (new); `TASKS.md` (status corrections). **Nothing in `dist/` touched.**

**Checks run and results:**
- Read `AGENTS.md`, `REQUIREMENTS.md`, `TASKS.md`, `docs/design-spec.md`, `docs/architecture.md`, `docs/reviews/antigravity-visual.md`, `README.md`, `.openai/hosting.json`, all three orchestration prompts — complete.
- Read `dist/index.html`, `dist/styles.css`, `dist/app.js` in full; inspected `dist/assets/dudu-hero.png` (confirmed 1536×1024).
- Verified all 9 QA-001 findings against source; 9/9 describe real code, 2 have incorrect evidence (§4).
- Recomputed WCAG contrast for every text/background pair in the stylesheet → **2 failures** (QA2-01).
- Recomputed hero crop geometry from the real image dimensions → QA-001 F-02 points at the wrong cup.
- Recomputed marquee half-width → F-03 confirmed.
- **Not run:** HTTP server, browser, any of `docs/architecture.md` steps 1–7. **Environment blocked — see §1.**

**Remaining risks / decisions:**
1. **Shell unavailable** — the runtime verification gate cannot be passed by anyone (Codex included) until the workspace permission issue is resolved. This is the top blocker.
2. QA-001 never tested the 320px minimum → new task QA-003.
3. F-02's accepted fix is wrong; implementing it as written would leave the matcha cup clipped.
4. F-06 is AAA, not AA — must not be bundled with the genuine AA contrast failures in QA2-01.
5. QA2-07/08/09 need human decisions and cannot be closed by Codex.

**Recommended next owner:** **Human owner** — to restore shell access, then **Codex (FE-003)** for F-01, F-03–F-09 (as corrected), QA2-01, QA2-02, QA2-03, QA2-04, QA2-06, followed by **Antigravity (QA-003)** to confirm the F-02 framing fix and the 320px layout. Do not start FE-003 until the F-02 correction in §4.1 is accepted.
