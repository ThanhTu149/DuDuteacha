# DuDu — Bảng công việc (Task Board)

Bảng theo dõi Phase 3 (triển khai định hướng art direction đã kiểm chứng) và Phase 6 (vòng lặp fix → review), nghiệm thu trên 5 viewport: 320 / 390 / 768 / 1024 / 1440.

## Trạng thái tổng

- Triển khai đã xong. Bộ test tự động: **55/55 PASS** (nền trước khi làm: 52/53).
- Tương phản: **334/334 mẫu chữ đạt WCAG AA**, thấp nhất đo được 5,39:1; viền focus 16,80:1; toàn bộ icon và viền control ≥ 3:1.
- Tràn ngang: `scrollWidth === clientWidth` ở cả 5 viewport; **0 phần tử** vượt mép.
- Antigravity review bản build (QA-003): **0 High, 0 Medium, 4 Low** — cả 4 Low đã được sửa và đo lại.

| ID | Owner | Status | Deliverable | Acceptance criteria |
|---|---|---|---|---|
| PM-001 | DeepSeek Harness | Complete | Giữ bảng công việc khớp thực tế; phân loại 11 đề xuất Antigravity trong `docs/reviews/ux-plan.md`. | Mỗi đề xuất có mã, một phân loại (Accepted / Accepted with correction / Rejected / Needs owner decision) và bằng chứng kiểm chứng. |
| UX-000 | Antigravity | Complete | `docs/reviews/antigravity-art-direction.md` — art direction 20 mục, 11 đề xuất (agy conversation `a9b72822-843d-47b5-9634-1ae21bcb9309`). | Đo trên 5 viewport; đủ MUST-01..04, SHOULD-01..04, NICE-01..03; không sửa `dist/`. |
| UX-101 | DeepSeek Harness | Complete | Kiến trúc thông tin: thứ tự section, dàn ý heading, cấu trúc landmark. | Một `h1` duy nhất; heading theo cấp; landmark `header`/`main`/`footer` + `nav` có nhãn; thứ tự Hero → Ticker → Menu → Story → Visit → Footer. **Đo được:** `nav` có `aria-label`, drawer là `role="dialog" aria-modal="true"`. |
| UI-101 | DeepSeek Harness | Complete | Design token: màu, cặp tương phản, thang chữ an toàn cho dấu tiếng Việt, thang khoảng cách 8px. | Heading line-height ≥ 1,2; token focus ≥ 3:1; khoảng cách là bội số 8px. **Đo được:** `--line-strong` 4,55:1 (mốc cũ 1,86:1); 334/334 mẫu chữ đạt AA. |
| UI-102 | DeepSeek Harness | Complete | Header và điều hướng, gồm pill nav mobile với vùng chạm ≥ 44px. | Tại 320px mỗi link nav ≥ 44×44px. **Đo được:** 64,4×44 / 116,2×44 / 91,4×44 (mốc cũ 39×24,3). |
| UI-103 | DeepSeek Harness | Complete | Hero: sửa lỗi ảnh cao 1024px, `aspect-ratio` thật, canh chủ thể, đặt lại sticker và caption. | `height: auto` + `aspect-ratio` thật; ảnh hero không còn 1024px ở cả 5 viewport. **Đo được:** 262×175 / 328×219 / 674×379 / 488×326 / 662×441 (mốc cũ 250×1024 … 590×1024). |
| UI-104 | DeepSeek Harness | Complete | Thẻ món: ly theo nhóm vị, tiêu đề xuống dòng gọn, nút thêm 44px, trạng thái hover/active/focus. | Trà trái cây không có trân châu; `.add-button` ≥ 44px. **Đo được:** `.cup-fill` biến thể jelly cho 2 món trà trái cây; add-button 44×44 (mốc cũ 42×42); 6 thẻ cao bằng nhau ở cả 5 viewport. |
| UI-105 | DeepSeek Harness | Complete | Cart drawer: toast không đè nút copy, empty state, nút tăng/giảm, phản hồi copy, tóm tắt kiểu hoá đơn. | Toast không phủ `#copy-order`. **Đo được:** khoảng cách toast → summary = 16,1px ở cả 5 viewport, không chồng lấn. |
| UI-106 | DeepSeek Harness | Complete | Tinh chỉnh responsive 320/390/768/1024/1440, nhịp section, không tràn. | Không tràn ngang ở 5 viewport. **Đo được:** overflow = 0 tại 320/390/768/1024/1440. |
| A11Y-101 | DeepSeek Harness | Complete | Focus ring, luồng giỏ hàng bàn phím, `inert` nền, reduced motion, touch target, nhãn screen reader. | Focus ring ≥ 3:1; Tab/Escape/trả focus đúng; nền `inert`; reduced motion tắt chuyển động. **Đo được:** focus ring 16,80:1; nút đóng drawer focus được; Tab lặp trong drawer; Escape trả focus về nút mở; ticker `animation-name: none` khi reduced motion. |
| QA-101 | DeepSeek Harness | Complete | Harness regression đa viewport + lần chạy nghiệm thu cuối. | 55 ca test (T1–T11) gồm HTTP 200, 3 filter, toán giỏ hàng, localStorage hỏng, drawer a11y, copy, reduced motion, touch target, overflow, an toàn thông tin kinh doanh. **Kết quả: 55/55 PASS.** |
| QA-003 | Antigravity | Complete | `docs/reviews/antigravity-build-review.md` — review thị giác bản build (agy conversation `e991252a-1bae-4f9e-a926-bbf1b40b7198`). | Xác nhận/bác bỏ từng đề xuất kèm số đo; không sửa `dist/`. **Kết quả: 0 High, 0 Medium, 4 Low** (REV-01..REV-04) — cả 4 đã sửa và đo lại trong `docs/reviews/antigravity-build-review.md` §6. |
| QA-FINAL | Antigravity | Complete | Gate chỉ-đọc trên build cuối (agy conversation `76d6d23b-d94e-46cb-bc2b-6ad300599ca7`). | Kiểm tra lại 320/390/768/1024/1440 sau REV-01..REV-04: **FINAL GATE PASS**, 0 High, 0 Medium, không sửa `dist/`. |
| BIZ-001 | Human owner | Needs owner decision | Xác nhận giá menu thật, địa chỉ, số điện thoại, giờ mở cửa và kênh nhận đơn. | Chủ quán cung cấp thông tin thật; nếu chưa có, site tiếp tục ghi "đang cập nhật" và không được bịa. |
| BIZ-002 | Human owner | Needs owner decision | (a) Tự host Fraunces + Be Vietnam Pro dạng woff2 trong `dist/assets/fonts/` hay tiếp tục Google Fonts; (b) phê duyệt giọng văn cho thẻ "06 món minh hoạ" và câu "Một ngụm dịu vị, cả ngày thêm vui." ghi là "DuDu nhắn bạn". | Có quyết định bằng văn bản; nếu tự host thì tiêu chí "loads with local assets" đạt, nếu không thì ghi nhận ngoại lệ có ý thức. |

## Vòng lặp fix → review (Phase 6)

Vòng 1 — review bản build:

- Antigravity QA-003: 0 High, 0 Medium, 4 Low.
- REV-01 `.brand` tại 320px chỉ rộng 36px → **đã sửa** (`min-width: 44px`); đo lại 44×44.
- REV-02 `.hero h1` và `.stat-number` có `scrollHeight > clientHeight` → **đã sửa** (heading line-height 1,2; stat line-height 1,2); đo lại delta = 0 ở cả 5 viewport (còn 1px sub-pixel tại 1024px, không gây che khuất vì `overflow: visible`).
- REV-03 chiều cao thẻ menu lệch ~32px → **đã sửa** (`min-height` cho tiêu đề và mô tả); đo lại 6 thẻ cao bằng nhau ở cả 5 viewport.
- REV-04 `min-height` cho `.stat-number` → **đã xử lý** cùng REV-02.

Vòng 2 không cần thiết: sau khi sửa 4 finding Low, bộ test vẫn 55/55 và không phát sinh finding mới. Vòng lặp dừng ở đây theo điều kiện kết thúc (không còn High/Medium).

## Phụ thuộc

- QA-003 đã hoàn tất sau khi UI-101–UI-106, A11Y-101 và QA-101 xong.
- BIZ-001 và BIZ-002 không chặn code; chỉ chặn việc công bố site ra công chúng.

## Status values

- **Ready** — đã đủ điều kiện bắt đầu, chưa ai nhận.
- **In progress** — đang có người làm.
- **Blocked** — chờ đầu việc khác hoặc chờ quyết định.
- **Complete** — đã xong và có bằng chứng đo được.
- **Needs owner decision** — người triển khai không thể tự đóng; cần chủ quán quyết.

## Quy tắc bảng

- Mỗi file chỉ có một người sở hữu trong một phase; không để hai người sửa cùng lúc.
- Chỉ làm việc bắt đầu từ một dòng có ID trong bảng này.
- Kết quả review ghi vào `docs/reviews/`, không viết lại âm thầm bàn giao của người khác.
- Không bịa địa chỉ, số điện thoại, review hay xác nhận đơn hàng thật.
