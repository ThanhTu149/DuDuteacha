# DuDu Milk Tea Website — Requirements

## Goal

Create a polished Vietnamese marketing and menu website for DuDu, a youthful milk-tea brand in Ho Chi Minh City. Visitors should quickly understand the brand, browse drinks, add items to a local cart, and copy an order summary.

## Audience

- Students and young professionals who enjoy milk tea.
- Mobile-first visitors deciding what to drink.
- People who care about sweetness level, fresh tea, and toppings.

## Required experience

- Strong DuDu identity with plum, cream, pink, and lime colors.
- Hero section with a distinctive product image.
- Filterable menu with six realistic sample drinks and prices.
- Functional local cart with quantity controls, total, persistence, and copy-to-clipboard.
- Brand story and visit information.
- Responsive desktop and mobile layouts.
- Keyboard focus, semantic HTML, reduced-motion support, and readable contrast.

## Current business assumptions

- Address, phone number, social handles, and live delivery integration are not known.
- The website must label these as pending instead of inventing details.
- Menu items and prices are sample content and should be confirmed before public launch.
- The first deployment remains private until the owner chooses to share it.

## Out of scope for this version

- Real payment processing.
- Sending orders to Zalo, Facebook, or a POS.
- Customer accounts, loyalty points, or an admin dashboard.
- Database-backed inventory.

## Acceptance criteria

- No horizontal overflow at 320px, 768px, or 1440px.
- Menu filters update visible products correctly.
- Cart add/increase/decrease, totals, local persistence, and copy action work.
- Cart drawer opens, closes, restores focus, and closes with Escape.
- No fake business facts or successful-order messages.
- Static site loads from `dist/index.html` with local assets.

