# Architecture and Verification

## Stack

The production site is intentionally buildless: semantic HTML, modern CSS, and plain JavaScript in `dist/`. This keeps deployment fast and makes the project easy for all three agents to inspect.

## Files

- `dist/index.html`: structure, content, metadata, and accessible labels.
- `dist/styles.css`: design tokens, layout, components, and responsive rules.
- `dist/app.js`: menu data, filters, cart state, drawer, clipboard, and toast.
- `dist/assets/dudu-hero.png`: generated DuDu product artwork.
- `.openai/hosting.json`: private Sites deployment identity and static output path.

## Verification checklist

1. Open `dist/index.html` through an HTTP server.
2. Check widths 320, 390, 768, 1024, and 1440px.
3. Test all three menu filters.
4. Add two different drinks, change quantities, refresh, and confirm persistence.
5. Copy an order and verify names, quantities, subtotals, and total.
6. Open the cart with keyboard, close with Escape, and verify focus returns.
7. Confirm there are no console errors, missing local assets, or horizontal overflow.
8. Confirm no real-world business detail was invented.

