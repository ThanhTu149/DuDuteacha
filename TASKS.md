# DuDu Task Board

| ID | Owner | Status | Deliverable |
|---|---|---|---|
| PM-001 | DeepSeek Harness | Complete | Validate requirements and keep this board current |
| UX-001 | Antigravity | Complete | `docs/design-spec.md` |
| FE-001 | Codex | Complete | Responsive landing page in `dist/` |
| FE-002 | Codex | Complete | Menu filter and local cart behavior |
| QA-001 | Antigravity | Complete | Visual review at mobile, tablet, and desktop sizes |
| QA-002 | DeepSeek Harness | Complete | Requirements and regression review in `docs/reviews/qa.md` |
| ENV-001 | Codex | Complete | Confirmed the shell limitation applied only to the DeepSeek headless sandbox; Codex runtime works |
| FE-003 | Codex | Complete | Fixed confirmed findings F-01–F-09, QA2-01–QA2-07, and QA-003 follow-ups |
| QA-003 | Antigravity | Complete | Re-reviewed 320/390/768/1440 widths; final three CSS refinements handed to Codex and applied |
| BIZ-001 | Human owner | Needed before public launch | Confirm menu prices, address, phone, and order channel |
| BIZ-002 | Human owner | Needed before public launch | Decide opening hours, attributed testimonial quote, "Bán chạy" badge, and font hosting (`qa.md` §6) |

## Current gate

QA-002 is complete and the review findings are confirmed, so the QA gate on FE-003 is lifted.
`ENV-001` is resolved: the reported shell failure was isolated to DeepSeek Harness's internal
headless sandbox. Codex can run the required local server and verification commands.
QA-003 completed the browser/visual pass at 320, 390, 768, and 1440px. Codex applied the final
hero framing, Vietnamese line-height, and cart hover refinements recorded in that review.

## Status values

`Ready` · `In progress` · `Blocked` · `Complete`
