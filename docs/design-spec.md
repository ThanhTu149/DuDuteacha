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

---

# Phần bổ sung: hệ thống đã triển khai (DeepSeek Harness, sau vòng review QA-003)

> Phần trên là đặc tả gốc của Antigravity và **không bị sửa**. Phần này ghi lại đúng những gì đã được build trong `dist/`, để đặc tả và mã nguồn không lệch nhau. Mọi con số dưới đây đo được từ trình duyệt thật.

## Token đã dùng

Giữ nguyên nhận diện cốt lõi. Bổ sung các token sau:

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--pink` | `#f06a8a` | **Chỉ dùng cho nền và trang trí.** Không dùng cho chữ. |
| `--pink-ink` | `#bd2854` | Màu hồng dùng cho **chữ**: 5,61:1 trên paper, 5,39:1 trên cream. |
| `--muted` | `#6d4f5e` | 6,89:1 trên paper (bản cũ `#765867` chỉ 4,83:1 trên nền caramel). |
| `--focus-ring` | `#35071f` | Viền focus: **16,80:1** trên paper. Bản cũ `#f06a8a` chỉ 2,72:1 — trượt WCAG 2.2 SC 2.4.13. |
| `--line-strong` | `#8a6a7c` | Viền control (nút đóng, nút tăng/giảm, chip chưa chọn): **4,55:1**. Bản cũ `rgba(90,18,54,.3)` chỉ 1,86:1 — trượt SC 1.4.11. |
| `--line` | `rgba(90,18,54,.16)` | Chỉ dùng cho đường phân cách trang trí, không phải control. |
| `--radius-lg` / `--radius-xl` | `24px` / `32px` | Đặc tả gốc ghi 34–48px; bản build dùng 24/32px để bo góc không cắt vào sản phẩm trong ảnh hero. Bo góc hero: `clamp(18px, 2.6vw, 32px)`. |
| `--space-1` … `--space-9` | 4 → 80px | Thang 8 điểm. |

## Thang chữ tiếng Việt đã dùng

| Vai trò | Token | Line-height |
|---|---|---|
| Hero H1 | `clamp(2.5rem, 8.6vw, 5.25rem)` | `1.2` |
| Section H2 | `clamp(2rem, 6.4vw, 4rem)` | `1.2` |
| Story H2 | `clamp(1.75rem, 5.6vw, 3.5rem)` | `1.22` |
| Card H3 | `clamp(1.25rem, 3.2vw, 1.625rem)` | `1.24`, `min-height: 2.55em` |
| Stat number | `clamp(3rem, 7vw, 5.5rem)` | `1.2` |

`line-height` toàn bộ heading là **≥ 1,2** (đặc tả gốc ghi 1,08). Đo lại sau khi sửa: `scrollHeight − clientHeight` = **0px** cho `.hero h1` và `.stat-number` ở cả 5 viewport, tức không còn dấu tiếng Việt tràn khỏi hộp dòng.

## Hero hợp phần

Ảnh gốc 1536×1024 (tỉ lệ 3:2); khối đồ uống thật nằm ở x = 596…1470, tức **trung tâm chủ thể ở 67% chiều rộng ảnh**, không phải 50%. Vì vậy:

- Bắt buộc có `height: auto` — thuộc tính HTML `height="1024"` là presentational hint và **thắng** khai báo `aspect-ratio` nếu CSS không đặt `height`.
- `object-position: 67% center` đặt đúng tâm chủ thể.
- Tỉ lệ khung: **16/9** cho 720–999px (tablet), **3/2** cho ≥ 1000px (desktop, đúng tỉ lệ gốc nên không crop).
- Khung ảnh có lớp phủ `mix-blend-mode: multiply` để dải letterbox của ảnh gốc hoà vào nền, không lộ đường nối.

## Layout theo breakpoint

| Breakpoint | Hero | Menu | Story |
|---|---|---|---|
| < 720px | 1 cột, copy trên ảnh dưới | 1 cột | 1 cột |
| 560–719px | 1 cột | 2 cột | 1 cột |
| 720–999px | **1 cột, copy full-width rồi ảnh full-width 16:9** | 2 cột | 2 cột (main trái) |
| ≥ 1000px | 2 cột (0.88fr / 1.12fr) | 3 cột | 2 cột (1.4fr / 0.6fr) |

Ghi chú: đặc tả gốc đề xuất hero 2 cột từ 641px. Đo thực tế cho thấy ở 768px cách đó để lại một khoảng trống lớn cạnh cột copy (cột copy cao ~600px so với ảnh phong cảnh), nên bản build dùng 1 cột xếp dọc cho 720–999px và chỉ tách 2 cột từ 1000px. Đây là **điều chỉnh có đo đạc**, không phải bỏ qua đặc tả.

## Ngăn kéo giỏ hàng

- Toast được neo phía trên khối `#cart-summary` bằng biến `--summary-h` do JS công bố qua `ResizeObserver`. Đo được: khoảng cách toast → summary = **16,1px**, không chồng lấn nút "Sao chép đơn hàng" ở cả 5 viewport.
- `inert` chỉ đặt cho `.site-header`, `main`, `footer` — **không** dùng selector `header` trần, vì sẽ khớp cả `header` bên trong drawer và làm nút đóng mất khả năng nhận focus.
- Sau khi đặt `inert`, cần ép reflow trước khi gọi `focus()`, nếu không trình duyệt sẽ bỏ qua lệnh focus.

## Ảnh minh hoạ theo nhóm vị

- **Trà sữa**: `.cup-fill` là trân châu đường đen.
- **Trà trái cây**: biến thể `.drink-cup--fruit`, `.cup-fill` là thạch trong suốt (repeating-linear-gradient), ống hút mảnh hơn, **không có trân châu đen**.

## Trạng thái bắt buộc có

Mọi control đều có `:hover`, `:active` và `:focus-visible`. Nút thêm món đổi sang dấu tích lime trong 700ms khi thêm thành công. Badge số lượng trên nút giỏ hàng "nảy" khi số thay đổi. Marquee tạm dừng khi hover hoặc khi có focus bên trong.
