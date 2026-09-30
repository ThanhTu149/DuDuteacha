# DuDu AI Team Rules

This repository is maintained by three AI systems. Every agent must read this file, `REQUIREMENTS.md`, and `TASKS.md` before acting.

## Roles

- **DeepSeek Harness — coordinator and QA:** breaks work into tasks, checks acceptance criteria, and writes review notes. It does not directly change `dist/` during implementation.
- **Antigravity — visual designer and browser reviewer:** owns `docs/design-spec.md` and visual review files in `docs/reviews/`. It may not change `dist/app.js` or business behavior unless a task explicitly transfers ownership.
- **Codex — implementation owner:** owns the production code in `dist/`, integration, accessibility, and final verification.

## Shared rules

1. One owner per file per phase. Never let two agents edit the same file concurrently.
2. Work only from an assigned item in `TASKS.md`.
3. Preserve the Vietnamese brand voice: warm, youthful, concise, and clear.
4. Do not invent real addresses, phone numbers, reviews, certifications, or delivery integrations.
5. Do not claim an order was sent. The current cart is a local demonstration that copies an order summary.
6. Keep the site usable at 320px width and with keyboard-only navigation.
7. Run the checks in `docs/architecture.md` before marking implementation complete.
8. Record review findings in `docs/reviews/`; do not silently rewrite another agent's deliverable.

## Handoff format

Every agent ends its work with:

- Task ID
- Files changed
- Checks run and results
- Remaining risks or decisions
- Recommended next owner

