# DuDu Design Specification

## Visual thesis

DuDu should feel like an energetic neighborhood milk-tea shop: deep plum gives it confidence, cream keeps it welcoming, and sharp pink/lime accents make it playful. The composition uses oversized editorial type beside tactile product imagery rather than a generic café template.

## Layout

- Header: compact wordmark, three navigation links, persistent cart pill.
- Hero: editorial headline on the left; three-drink product image in an organic frame on the right.
- Ticker: short proof points, visually separating the hero from the menu.
- Menu: filters first, then a responsive three/two/one-column product grid.
- Story: asymmetric plum, lime, and pink cards.
- Visit: concise location, hours, and ordering status.
- Cart: right-side drawer with quantity controls and copyable summary.

## Tokens

- Plum `#5A1236`; deep plum `#35071F`
- Cream `#FFF5DF`; paper `#FFFAF0`
- Lime `#C9F36D`; pink `#F06A8A`
- Display: Fraunces; body: Be Vietnam Pro
- Large radii: 34–48px; compact controls: full pill or circular

## Responsive behavior

- Above 980px: two-column hero, three-column menu, asymmetric story grid.
- 641–980px: stacked hero, two-column menu, single-column story.
- 320–640px: compact header, single-column cards, full-width drawer, large tap targets.

## Interaction notes

- Every add action gives a short toast and updates the header count.
- Menu filtering uses pressed-state buttons.
- Cart preserves items in local storage and never claims that an order was submitted.
- Motion is subtle and disabled when reduced motion is requested.

