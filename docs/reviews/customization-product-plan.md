# DuDu — Kế hoạch iteration: Product Customization Flow

**Task ID:** `PM-002` (Product Lead + QA planner — DeepSeek Harness)
**Owner của tài liệu này:** DeepSeek Harness (coordinator & QA)
**Đầu vào đã đọc:** `AGENTS.md`, `REQUIREMENTS.md`, `TASKS.md`, `docs/design-spec.md`, `docs/architecture.md`, `dist/index.html`, `dist/styles.css`, `dist/app.js`, `docs/reviews/qa.md`, `docs/reviews/antigravity-visual.md`, `docs/reviews/antigravity-art-direction.md`, `docs/reviews/ux-plan.md`, `docs/reviews/antigravity-build-review.md`, **`docs/reviews/customization-visual-spec.md` (UX-201 / DES-002)**.
**Đã thay đổi:** chỉ tạo mới duy nhất tập tin này. `dist/`, `TASKS.md` và mọi tập tin khác **không bị sửa**.
**Phạm vi:** demo local. Không thanh toán, không gửi đơn, không tích hợp POS/Zalo/Facebook. Không bịa dữ liệu kinh doanh.

> **Giới hạn kiểm chứng của phiên này (đọc trước).** Phiên DeepSeek Harness này **không chạy shell và không chạy trình duyệt**, theo yêu cầu. Vì vậy mọi con số trong tài liệu này thuộc một trong hai loại, và tôi ghi rõ loại nào:
>
> | Loại | Nguồn | Trạng thái |
> |---|---|---|
> | **Số đo kế thừa** (`--line-strong` 4,55:1, focus ring 16,80:1, `--pink-ink` 5,39–5,61:1, `--muted` 6,89:1, overflow = 0 ở 5 viewport, 55/55 test) | `TASKS.md`, `docs/design-spec.md`, `docs/reviews/antigravity-build-review.md` | **Có thật, nhưng đo trên bản build cũ.** Không tự động đúng cho UI mới — phải đo lại. |
> | **Suy luận tĩnh** (cấu trúc mã, đường đi sự kiện, va chạm selector, công thức giá) | Đọc trực tiếp `dist/*` trong phiên này | **Đã kiểm chứng ở mức mã nguồn**, chưa kiểm chứng ở mức render. |
> | **Số đo cho UI mới** | — | **Chưa tồn tại.** Mọi ngưỡng dưới đây là *điều kiện nghiệm thu*, không phải kết quả. |
>
> Không có kết quả runtime nào được tuyên bố trong tài liệu này.

---

## 1. Mục tiêu iteration và phạm vi

### 1.1 Mục tiêu người dùng

Trước khi một ly vào giỏ, người dùng chọn được **cỡ ly, mức đường, mức đá, topping**. Giỏ hàng **phân biệt hai cấu hình khác nhau của cùng một món**, **tính và hiển thị giá phụ thu minh bạch**, **giữ được qua localStorage**, và **sao chép đơn có đầy đủ cấu hình**.

### 1.2 Trong phạm vi

- Một hộp thoại tùy chỉnh (`role="dialog"`, modal) mở từ nút `+` trên thẻ món.
- Bốn nhóm lựa chọn: Size (bắt buộc, 2 mức), Đường (bắt buộc, 5 mức), Đá (bắt buộc, 4 mức), Topping (tùy chọn, 5 loại, tối đa 3).
- Bộ đếm số lượng trong hộp thoại (1–20) và nút CTA hiển thị tổng tiền trực tiếp.
- Giỏ hàng: mỗi dòng là một **cấu hình**, không phải một món.
- `localStorage` có version + migration từ dữ liệu phẳng cũ.
- Định dạng văn bản sao chép đơn có đầy đủ thông số.
- Toàn bộ trạng thái control, focus, reduced-motion, 5 viewport.

### 1.3 Ngoài phạm vi (không được tự mở rộng)

- Thanh toán, mã giảm giá, phí giao hàng, chọn đá/đường theo từng món khác nhau (per-product option matrix).
- Tài khoản, điểm thưởng, tồn kho, admin.
- Mọi kênh nhận đơn thật.
- **Không** áp dụng chip lọc thứ tư hoặc taxonomy "mood" — đã bị `ux-plan.md` §4.3 bác bỏ; menu vẫn là 6 món / 2 nhóm / 3 chip.

### 1.4 Ràng buộc bắt buộc

| # | Ràng buộc | Nguồn |
|---|---|---|
| C1 | Giữ nguyên nhận diện: plum/cream/paper/lime/pink + Fraunces & Be Vietnam Pro | `design-spec.md`, `ux-plan.md` §1 |
| C2 | Mọi control ≥ 44×44px; focus ring ≥ 3:1; chữ ≥ 4,5:1 (nhỏ) / ≥ 3:1 (lớn); viền control ≥ 3:1 | `REQUIREMENTS.md`, AC-05, MUST-04 |
| C3 | Không tràn ngang tại 320/390/768/1024/1440; `scrollWidth === clientWidth` | AC-06 |
| C4 | Dùng được hoàn toàn bằng bàn phím; Escape đóng và trả focus | `AGENTS.md` rule 6, A11Y-101 |
| C5 | Không bịa giá, địa chỉ, giờ, hotline, review; không tuyên bố đơn đã gửi | `AGENTS.md` rule 4–5, AC-09 |
| C6 | Mọi phụ thu phải có nhãn "minh hoạ" ở nơi người dùng nhìn thấy | AC-CUST-09 |
| C7 | Một người sở hữu một tập tin trong một phase | `AGENTS.md` rule 1 |
| C8 | Lime = màu lọc/điểm nhấn, plum = màu hành động. Không đổi vai trò token | `ux-plan.md` §4.4 |
| C9 | Không dùng emoji trong control lọc/chọn (render khác nhau theo OS, không kiểm soát được tương phản) | `ux-plan.md` §4.3 |

---

## 2. Đối chiếu với `customization-visual-spec.md` (UX-201 / DES-002)

Antigravity đã có sẵn một đặc tả đầy đủ cho đúng tính năng này. Tài liệu này **không viết lại** nó. Dưới đây là phân loại từng phần theo đúng thang của `ux-plan.md` §1.4, và những chỗ phải sửa trước khi Codex viết mã.

**Nguyên tắc áp dụng (`ux-plan.md` §1.5):** đặc tả của Antigravity là đầu vào tham khảo, **không phải danh sách việc phải làm**.

### 2.1 Được chấp nhận nguyên trạng

| Mã | Nội dung | Vì sao chấp nhận |
|---|---|---|
| DES-A01 | Ma trận lựa chọn và mức phụ thu (§2.1): Size M 0₫ / L +6.000₫; Đường 5 mức 0₫; Đá 4 mức 0₫; 5 topping +5.000/+5.000/+6.000/+10.000/+8.000 | Nhất quán với giá món hiện có (37.000–49.000₫); mọi mức đều là giá trị minh hoạ có nhãn |
| DES-A02 | Công thức giá (§2.2): `unit = base + sizeSurcharge + Σ toppings`; `line = unit × qty` | Đúng, đơn giản, kiểm thử được từng đồng |
| DES-A03 | Mặc định Size M / 50% đường / 70% đá / không topping | Có lý do thương hiệu, và là *preset minh hoạ* chứ không phải tuyên bố công thức của quán |
| DES-A04 | `fieldset` + `legend` cho mỗi nhóm; radio cho size/đường/đá; checkbox cho topping | Đúng WAI-ARIA, dùng HTML gốc, hoạt động khi JS lỗi một phần |
| DES-A05 | Dùng lại `backgroundLandmarks()` + `inert` + ép reflow trước `focus()` | Tái dùng đúng cơ chế đã kiểm chứng ở A11Y-101 và `design-spec.md` §Ngăn kéo |
| DES-A06 | Giới hạn tối đa 3 topping, các topping còn lại chuyển `disabled` | Có quy tắc rõ, tránh tràn ly; tạo được test biên |
| DES-A07 | Nhãn minh hoạ cạnh mọi phụ thu ("+6.000 ₫ *minh hoạ*", dòng disclaimer chân hộp thoại) | Thoả C6 và AC-09 |
| DES-A08 | Bottom-sheet < 720px → centered dialog ≥ 720px; `env(safe-area-inset-bottom)` | Khớp breakpoint 719/720 đang dùng trong `styles.css` |
| DES-A09 | Reduced-motion: tắt transition/transform, dialog hiện tức thì | Khớp `styles.css` 1204–1252 |
| DES-A10 | Escape đóng **không lưu** và trả focus về nút đã kích hoạt | Đúng kỳ vọng người dùng |
| DES-A11 | Dòng giỏ hàng có pill Size + dòng thông số ` · ` + dòng topping | Đúng yêu cầu "giỏ phải phân biệt hai cấu hình" |
| DES-A12 | Định dạng copy đơn (§9.3) — mỗi dòng kèm `(Size, % đường, % đá, thêm: …)` | Đúng yêu cầu, và giữ câu disclaimer ở cuối |

### 2.2 Được chấp nhận **kèm hiệu chỉnh** (phải sửa trước khi code)

| Mã | Vấn đề trong DES-002 | Hiệu chỉnh bắt buộc |
|---|---|---|
| **DES-C01** | §10.2 ẩn input bằng `position:absolute; opacity:0; pointer-events:none`, nhưng §6.2 lại yêu cầu **focus vào radio Size M**. Phần tử `opacity: 0` vẫn nhận focus, nhưng người dùng bàn phím **không thấy gì**, và quy tắc `:focus-visible` ở `styles.css:189–194` áp `border-radius: var(--radius-sm)` + halo 5px lên chính input vô hình đó. | Dùng **visually-hidden nhưng focusable** thật sự: `clip-path: inset(50%)`, `width/height: 1px`, `overflow: hidden`, `white-space: nowrap` — **không** `display:none`, **không** `opacity:0`. Focus indicator phải vẽ bằng `:focus-visible + .chip-content` / `+ span` / `~ .topping-box` trên **phần tử nhìn thấy được** |
| **DES-C02** | §10.2 `.custom-backdrop` dùng `hidden` + `visibility` + `opacity`, nhưng §10.1 đặt `hidden` **trên `<dialog>`** đồng thời khai `role="dialog" aria-modal="true"`. Trộn `hidden` với `role="dialog"` gây trạng thái không xác định cho AT, và `<dialog>` + `showModal()` sẽ tự sinh lớp `::backdrop` **chồng lên** `.drawer-backdrop` sẵn có. | **Không dùng `<dialog>`.** Dùng `<div role="dialog" aria-modal="true" aria-labelledby aria-describedby>` với `aria-hidden` + `visibility`, **đúng khuôn mẫu đã kiểm chứng của `.cart-drawer`** (`styles.css:1055–1074`). Một cơ chế overlay, một cách kiểm thử |
| **DES-C03** | §10.1 đặt `<form method="dialog">` quanh thân hộp thoại, với nút `type="submit"`. Khi đó Enter ở **bất kỳ** control nào trong form sẽ submit và đóng hộp thoại **không thêm gì** — đúng lúc người dùng bàn phím đang chọn topping. | Bỏ `<form>`, hoặc giữ `<form>` nhưng nút CTA là `type="button"` + `preventDefault`. **Khuyến nghị: bỏ `<form>`** — không cần thiết, vì đã có `<fieldset>` cho ngữ nghĩa nhóm |
| **DES-C04** | §4.2 yêu cầu giá topping dùng `var(--pink-ink)`, nhưng §10.2 đặt nền `.topping-item` là `#fff`. `--pink-ink` chỉ được đo trên paper/cream (5,39–5,61:1); trên `#fff` tỉ lệ **thấp hơn** và chưa ai đo. | Chốt: `.topping-item` nền `#fff` ⇒ giá phụ thu dùng `var(--muted)` (6,89:1 trên paper) hoặc `var(--plum-deep)`; **hoặc** đổi nền hàng topping sang `var(--paper)`/`var(--cream)` rồi mới dùng `--pink-ink`. Không được để `--pink-ink` trên `#fff` mà chưa đo |
| **DES-C05** | §10.2 chỉ vẽ focus cho `.topping-item` bằng `text-decoration: underline` trên `.topping-name`. Đây **không** phải focus indicator đạt SC 2.4.13 (không đo được 3:1, không bao quanh control). | Thêm `box-shadow: 0 0 0 3px var(--focus-ring)` (hoặc `outline`) cho **toàn hàng** `.topping-item` qua `input:focus-visible ~ …`, đặt **sau** dòng 194 của `styles.css` để không bị ghi đè |
| **DES-C06** | §6.3 khai "Tab bị nhốt" nhưng §10.3 không có hàm trap; §6.2 mục 4 nói focus vào radio nhưng không nói **điều gì xảy ra khi có một overlay khác đang mở** (drawer đang mở mà bấm `+`). | Bổ sung **bất biến một-overlay**: mở customization khi drawer đang mở ⇒ đóng drawer trước. Và ngược lại: hành động "mở giỏ" từ trong hộp thoại ⇒ đóng hộp thoại trước rồi mới `openCart()`. Focus trap vẫn dựa trên `inert` landmark, **không** hand-roll key trap |
| **DES-C07** | §10.3 `openCustomizationDialog()` gọi `dialog.hidden = false` nhưng §10.1 khai `hidden` trên `<dialog>`; và §6.2 nói thêm class `dialog-open` trong khi drawer đã dùng `drawer-open`. Hai class này có thể cùng tồn tại ⇒ hai lớp `overflow: hidden` và hai lớp backdrop. | Một class trạng thái duy nhất trên `<body>`: `custom-open`. Trong `openCustomizationDialog()` phải gọi `closeCart()` nếu `body` đang `drawer-open`. `closeCart()` không được chạm hộp thoại và ngược lại |
| **DES-C08** | §8 đặt nhãn `50% DuDu khuyên thử ✨` **có emoji**, và `ux-plan.md` §4.3 đã bác bỏ emoji trong control vì render khác nhau và không kiểm soát được tương phản. | Bỏ emoji khỏi mọi control. Nếu muốn đánh dấu khuyến nghị, dùng **nhãn chữ** (`DuDu khuyên thử`) hoặc dấu chấm lime + `aria-describedby`, không dùng ký tự emoji |
| **DES-C09** | §10.1 đặt `aria-live="polite"` trên `#custom-qty-val`; §2.2 đặt cập nhật giá bằng `aria-live`. Nếu mỗi lần bấm `+`/`-`/chip đều phát live region, screen reader sẽ bị **ngắt lời liên tục**. | Một **vùng trạng thái duy nhất** (`role="status"`) phát câu tổng hợp đã hoàn chỉnh, ví dụ: *"Size L, 50% đường, 70% đá, 1 topping. Đơn giá 56.000 đồng, số lượng 2, tạm tính 112.000 đồng."* Số lượng và giá trong footer chỉ hiển thị, **không** tự phát live |
| **DES-C10** | §9.1 đặt `configKey = productId + "__" + size + "__" + sugar + "__" + ice + "__" + toppingsSorted` nhưng không nói toppings nối bằng gì, và cũng không nói **giá trị rỗng** biểu diễn thế nào. `aloe-pearls` và một id `aloe-pearls` sẽ va nhau. | Chốt canonical hoá ở §5.2: topping id **chỉ** `[a-z0-9]`, nối bằng `-`, sắp xếp tăng dần, rỗng = chuỗi `none`. Cấm mọi id chứa `-` hoặc `__` |
| **DES-C11** | §9.1 tuyên bố "tương thích ngược 100%" nhưng không nói **khoá lưu trữ** là gì. Nếu ghi đè `dudu-cart` bằng mảng `items`, một bản `dist/app.js` cũ còn cache sẽ `JSON.parse` ra mảng → `loadCart()` cũ trả `{}` (đã phòng thủ) nhưng dữ liệu người dùng đã đổi định dạng. | Ghi vào **khoá mới có version**: `dudu-cart-v2`. Đọc `dudu-cart` (phẳng) ⇒ migrate ⇒ ghi v2 ⇒ **xoá khoá cũ**. Sau đó chỉ đọc/ghi v2 |
| **DES-C12** | §9.1 lưu `unitPrice` trong từng item, nhưng §11 không có tiêu chí nào kiểm tra `unitPrice` có bị giả mạo/ô nhiễm qua localStorage hay không. | **Giá không bao giờ được tin từ localStorage.** Khi nạp: tra lại `product.price` + bảng phụ thu theo `productId`/`size`/`toppings`; bỏ qua `unitPrice` đã lưu và **luôn tính lại**. Ghi lại v2 sau khi chuẩn hoá để tự chữa dữ liệu |
| **DES-C13** | §10.1 dùng `id="custom-drink-name"` cho `<h2>` sản phẩm. Đây là `<h2>` thứ **tư** trong trang, nhưng nằm trong dialog nên nó là **heading cấp cao nhất của dialog** — chấp nhận được về WCAG, song phải khai `aria-level` hoặc đảm bảo dialog có heading riêng. Đồng thời `aria-describedby="custom-drink-desc"` trỏ tới mô tả món, làm tên dialog đọc ra kèm cả mô tả marketing mỗi lần mở. | Giữ `<h2>` cho tên món; **đổi `aria-describedby`** sang một dòng hướng dẫn ngắn, ổn định, có ý nghĩa điều hướng: `"Tùy chỉnh độ ngọt, đá và thêm topping yêu thích. Mọi phụ thu là giá minh hoạ."` |
| **DES-C14** | §10.3 chỉ có `openCustomizationDialog()` và `updateLivePriceUI()`; thiếu hàm đóng, hàm thêm vào giỏ, hàm đọc/ghi form, hàm chỉnh số lượng, hàm disable topping, và nhánh lỗi. | Bổ sung đầy đủ ở §7 (state machine) và §13 (task split). Đặc biệt phải có `collectCustomization()`, `closeCustomization(reason)`, `addConfiguredToCart()`, `syncToppingLimit()` |
| **DES-C15** | §4.3 yêu cầu nút Giảm ở số lượng 1 hiển thị `disabled` với `opacity: 0.35`. `opacity: 0.35` trên nút `1px solid var(--line-strong)` có thể **kéo viền control xuống dưới 3:1** (SC 1.4.11). | Nút Giảm: giữ `disabled` + `aria-disabled`, nhưng **không hạ opacity viền**. Dùng nền `var(--cream)` + chữ `var(--muted)` + viền giữ nguyên. Nếu vẫn hạ opacity thì phải **đo lại** viền ≥ 3:1 và ghi số vào tài liệu review |

### 2.3 Bị bác bỏ

| Mã | Nội dung | Lý do |
|---|---|---|
| DES-R01 | §10.2 khai `z-index` backdrop 95 / dialog 100 với giả định drawer là lớp trên cùng | Sai với thực tế `styles.css`: toast 110, drawer 90, backdrop 80, header 60. Giữ nguyên phân tầng hiện có, chỉ chèn: `.drawer-backdrop` 80 < `.cart-drawer` 90 < `.custom-backdrop` 95 < `.cart-drawer`-khi-mở-từ-dialog … **Chốt: không mở đồng thời.** Customization backdrop **96**, customization dialog **98**, toast **110** (`styles.css:1219`) |
| DES-R02 | §5.4 "Two-column Editorial Split Dialog" tại 1440px (cột trái 280px + cột phải 460px) | Đây là **mở rộng phạm vi thị giác**, không phải yêu cầu. Cột trái chỉ chứa minh hoạ + "Live Recipe Pill" — thêm một nguồn sự thật thứ hai cho cùng dữ liệu, tăng bề mặt lỗi và tăng chi phí đo ở 5 viewport. **Một cột, một layout, ở mọi viewport.** Nếu Antigravity muốn hai cột, phải là một task riêng có đo đạc |
| DES-R03 | §5.1 "cuộn ngang có điểm dừng snap" cho nhóm Đường/Đá ở 320px | `scroll-snap` + `overflow-x: auto` tạo vùng cuộn ngang bên trong một trang đã `overflow-x: hidden` (`styles.css:30`) — **phá khả năng chứng minh AC-CUST-01** và dễ gây tràn ngang thật. **Chốt: chỉ dùng lưới `auto-fit`/`1fr 1fr`, không bao giờ cuộn ngang.** Chip xuống dòng là chấp nhận được |
| DES-R04 | §10.1 `#btn-custom-decrease` khởi tạo `disabled` nhưng §10.3 không có hàm nào bật lại | Không phải bác bỏ ý tưởng, bác bỏ cách viết: trạng thái phải **suy ra từ `state.quantity`**, không khởi tạo cứng trong HTML |
| DES-R05 | §12 "Recommended next owner: DeepSeek … phân rã thành task thực thi **trong `TASKS.md`**" | Trong phase này tôi **không** sửa `TASKS.md` (theo yêu cầu trực tiếp của người dùng). Đề xuất task nằm ở §13 tài liệu này và sẽ được hợp nhất vào bảng ở phase sau, do người quyết định bảng thực hiện |

### 2.4 Cần chủ quán quyết (`BIZ-003`, mới)

Danh mục 5 topping và 5 mức phụ thu (5.000/5.000/6.000/10.000/8.000₫) cùng phụ thu Size L +6.000₫ là **giá trị minh hoạ do Antigravity đề xuất**. Chúng không được bịa thành dữ liệu thật, và cũng **không được coi là đã chốt**. Cần chủ quán xác nhận: (a) có bán size L hay không, (b) danh mục topping thật, (c) mức phụ thu thật, (d) preset độ ngọt/đá mặc định có đúng gu quán hay không. Cho tới khi có xác nhận, UI **phải** giữ nhãn "minh hoạ" cạnh mọi phụ thu. Không chặn code.

---

## 3. Data model

### 3.1 Bảng hằng số (client-only, không có backend)

```js
// Topping: id chỉ chứa [a-z0-9], không gạch nối, không "__"
var TOPPINGS = [
  { id: "pearls",         name: "Trân châu dẻo đường đen", price: 5000  },
  { id: "aloe",           name: "Thạch nha đam giòn",      price: 5000  },
  { id: "waterchestnut",  name: "Thạch củ năng bùi giòn",  price: 6000  },
  { id: "cheesefoam",     name: "Kem cheese béo mặn",      price: 10000 },
  { id: "mochi",          name: "Mochi kéo sợi mềm dẻo",   price: 8000  }
];

var SIZES   = [ { id: "M", label: "Size M", note: "350ml", surcharge: 0 },
                { id: "L", label: "Size L", note: "500ml", surcharge: 6000 } ];

var SUGARS  = [100, 70, 50, 30, 0];   // 50 là mặc định khuyến nghị
var ICES    = [100, 70, 30, 0];       // 70 là mặc định khuyến nghị

var DEFAULTS = { size: "M", sugar: 50, ice: 70, toppings: [] };
var MAX_TOPPINGS = 3;
var MAX_QTY = 20;
var STORAGE_KEY_V2 = "dudu-cart-v2";
var STORAGE_KEY_LEGACY = "dudu-cart";
```

**Quyết định:** mọi món dùng **cùng một** ma trận lựa chọn. Không có ngoại lệ theo món. Lý do: (1) giữ tính khả đoán cho người dùng, (2) tránh một bảng cấu hình per-product cần chủ quán duyệt riêng, (3) giữ `configKey` luôn có đủ 5 thành phần nên không cần nhánh `undefined`.

> **Ghi chú thương hiệu:** `variant` của món (`milk` / `fruit`) **không** đổi ma trận lựa chọn ở iteration này. Đặc tả DES §2.1 có ghi "với trà trái cây khuyến cáo giữ ≥70% đá" trong phần ghi chú trải nghiệm — điều này **chưa** được hiện thực và không nằm trong nghiệm thu. Nếu muốn, đó là một đề xuất riêng, không phải mặc định.

### 3.2 `configKey` — canonical hoá

```
configKey = productId + "__" + size + "__" + sugar + "__" + ice + "__" + toppingsKey
toppingsKey = "none"  nếu rỗng, ngược lại = toppings.slice().sort().join("-")
```

Ví dụ: `brown-sugar__L__50__70__pearls`, `brown-sugar__M__50__70__none`, `peach__L__70__100__waterchestnut`.

Bất biến:
- `productId` **không** chứa `__` (đúng với cả 6 id hiện có).
- topping `id` **không** chứa `-` và `__` (ràng buộc ở §3.1).
- `toppingsKey` luôn sắp xếp ⇒ thứ tự người dùng bấm không tạo ra hai dòng khác nhau.
- `configKey` **chỉ dùng để định danh**. Khi đọc, chỉ giải mã phần `productId` (phần trước `__` đầu tiên); mọi thành phần khác được dựng lại từ bản ghi có cấu trúc. Không parse ngược `toppingsKey` thành mảng.

### 3.3 Bản ghi giỏ hàng (lưu trong `localStorage`)

```json
{
  "version": 2,
  "items": [
    {
      "key": "brown-sugar__L__50__70__pearls",
      "productId": "brown-sugar",
      "size": "L",
      "sugar": 50,
      "ice": 70,
      "toppings": ["pearls"],
      "quantity": 2
    }
  ]
}
```

**Quyết định quan trọng:** `unitPrice` **không được lưu**. Giá luôn được suy ra từ `PRODUCTS` + `SIZES` + `TOPPINGS` ở thời điểm render. Lý do:

1. Loại bỏ hẳn lớp tấn công/ô nhiễm qua `localStorage` (DES-C12).
2. Khi chủ quán chốt giá thật (`BIZ-001`/`BIZ-003`), giỏ hàng cũ **tự đúng** theo bảng giá mới, không cần migration số thứ ba.
3. Không thể có hai nguồn sự thật cho cùng một con số.

`name` cũng không lưu: luôn tra từ `PRODUCTS` theo `productId`, nên đổi tên món tự lan xuống giỏ hàng.

### 3.4 Hàm thuần (kiểm thử được, không chạm DOM)

| Hàm | Vào | Ra | Ghi chú |
|---|---|---|---|
| `makeConfigKey(productId, size, sugar, ice, toppings)` | 5 thành phần | `string` | Canonical theo §3.2 |
| `unitPriceOf(record)` | bản ghi | `int` (VND) | `product.price + size.surcharge + Σ topping.price`; trả `0` nếu `productId` lạ |
| `lineTotalOf(record)` | bản ghi | `int` | `unitPriceOf(record) * record.quantity` |
| `cartTotalOf(items)` | mảng | `int` | Tổng `lineTotalOf` |
| `cartCountOf(items)` | mảng | `int` | Tổng `quantity` |
| `describeConfig(record)` | bản ghi | `string` | `"Size L, 50% đường, 70% đá, thêm: Trân châu dẻo đường đen"` |
| `normalizeRecord(raw)` | dữ liệu thô | bản ghi \| `null` | §5 validation |
| `mergeIntoCart(items, newRecord)` | mảng + bản ghi | mảng mới | Cùng `key` ⇒ cộng `quantity`; khác `key` ⇒ thêm dòng mới |

**Bất biến:** `unitPriceOf` và `lineTotalOf` không đọc DOM, không đọc `localStorage`, không dùng biến toàn cục mutable ⇒ test được bằng cách gọi hàm thuần.

### 3.5 Dạng tham chiếu của `unitPriceOf`

```js
function unitPriceOf(r) {
  var p = findProduct(r.productId);
  if (!p) return 0;
  var size = findSize(r.size);
  var sum = p.price + (size ? size.surcharge : 0);
  r.toppings.forEach(function (id) {
    var t = findTopping(id);
    if (t) sum += t.price;
  });
  return sum;
}
```

Mọi hàm khác trong §3.4 xây trên hàm này. Không có nơi nào khác trong mã được phép tự cộng giá.

---

## 4. State transitions

### 4.1 Hai máy trạng thái độc lập

**Máy A — overlay** (giá trị suy ra từ class trên `<body>`):

| Trạng thái | Điều kiện DOM | `inert` trên | Overlay hiển thị |
|---|---|---|---|
| `IDLE` | không có class | không | không |
| `CART` | `body.drawer-open` | `.site-header`, `main`, `footer` | `.drawer-backdrop` + `.cart-drawer` |
| `CUSTOM` | `body.custom-open` | `.site-header`, `main`, `footer`, `.cart-drawer` | `.custom-backdrop` + `.custom-dialog` |

**Bất biến:** `drawer-open` và `custom-open` **không bao giờ cùng tồn tại**. Đây là bất biến bắt buộc, không phải khuyến nghị — nếu vi phạm, `.cart-drawer` vừa là overlay đang mở vừa bị `inert`, và người dùng mất hết đường thoát.

**Máy B — bản nháp tùy chỉnh** (`custom`):

```
custom = { productId, size, sugar, ice, toppings: [], quantity: 1 }
```

| # | Từ | Sự kiện | Sang | Hành động bắt buộc |
|---|---|---|---|---|
| B1 | — (không có) | `[data-customize]` được kích hoạt | bản nháp = `DEFAULTS` cho món đó | Lưu `lastFocused = document.activeElement`; nếu `drawer-open` thì `closeCart()` trước; thêm `custom-open`; thêm `inert`; ép reflow; `focus()` radio Size đang chọn |
| B2 | đang mở | chọn radio Size / Đường / Đá | cùng trạng thái, field đổi | Cập nhật nhãn CTA + đơn giá; cập nhật vùng `role="status"`; **không** đóng |
| B3 | đang mở | toggle checkbox Topping | cùng trạng thái, mảng `toppings` đổi | Nếu chạm `MAX_TOPPINGS`: `syncToppingLimit()` disable các topping **chưa chọn**, giữ `aria-disabled` trên các ô đó. Cập nhật giá |
| B4 | đang mở | `+` / `−` số lượng | `quantity` trong `[1, MAX_QTY]` | Ở `1` thì nút `−` `disabled`; ở `MAX_QTY` thì nút `+` `disabled`; nút disabled **vẫn giữ viền ≥3:1** |
| B5 | đang mở | CTA "Thêm vào giỏ" | **đóng trước**, rồi thêm | `mergeIntoCart(cart, record)` → `renderCart()` → `closeCustomization("add")` → trả focus về nút `+` → **sau khi đã đóng** mới `toastMessage(...)`. Không bao giờ toast khi hộp thoại còn mở |
| B6 | đang mở | `Escape`, nút X, bấm backdrop | đóng, **huỷ bản nháp** | `closeCustomization("cancel")`; không ghi gì vào giỏ; trả focus về `lastFocused` nếu còn `isConnected` |
| B7 | đang mở | "Mở giỏ hàng" từ trong hộp thoại | đóng rồi mở `CART` | `closeCustomization("goto-cart")` **trước**, sau đó `openCart()`. Thứ tự này là bắt buộc để giữ bất biến §4.1 |
| B8 | bất kỳ | `resize` vượt qua mốc 720px | giữ nguyên `custom` | Layout đổi (bottom-sheet ↔ dialog) nhưng **state không reset**; chỉ đo lại nếu cần |

### 4.2 Sơ đồ chuyển trạng thái overlay

```
        [data-customize]                    [data-open-cart]
IDLE ──────────────────────► CUSTOM      IDLE ──────────────────► CART
  ▲                            │  │                                 │
  │  Escape / X / backdrop     │  │   CTA "Thêm vào giỏ"            │ Escape / X
  └────────────────────────────┘  │   (đóng, rồi merge + render)    │
                                  └──────────────► IDLE ────────────┘
                                                     │
                       "Mở giỏ hàng" trong CUSTOM ───┘
                       (đóng CUSTOM trước, rồi CART)
```

### 4.3 Chuyển trạng thái dữ liệu giỏ hàng

| Sự kiện | Tác động lên `items` |
|---|---|
| Nạp trang | `loadCart()` → migrate nếu cần → `normalizeRecord` từng dòng → **luôn tính lại giá** → render |
| Thêm cấu hình đã có trong giỏ | Dòng cũ: `quantity += newQuantity` (không tạo dòng thứ hai) |
| Thêm cấu hình chưa có | Thêm dòng mới ở cuối (thứ tự chèn được giữ) |
| `+` trên một dòng | `quantity += 1`, chặn ở `MAX_QTY` |
| `−` trên một dòng | `quantity -= 1`; về `0` thì **xoá dòng** |
| Xoá dòng cuối | Giỏ rỗng: hiện `#cart-empty`, ẩn `#cart-summary` (đúng như `renderCart()` hiện tại) |
| Bất kỳ thay đổi nào | Ghi `dudu-cart-v2` (bọc `try/catch`) |

---

## 5. Validation và canonical hoá

### 5.1 `normalizeRecord(raw)` — chạy cho **mọi** dòng nạp từ `localStorage`

| # | Kiểm tra | Nếu sai |
|---|---|---|
| V1 | `raw` là object thường, không `null`, không mảng | trả `null` |
| V2 | `typeof raw.productId === "string"` và `findProduct(raw.productId)` tồn tại | trả `null` (món đã bị xoá khỏi menu) |
| V3 | `SIZES` có `raw.size` | thay bằng `DEFAULTS.size` |
| V4 | `SUGARS` chứa `raw.sugar` | thay bằng `DEFAULTS.sugar` |
| V5 | `ICES` chứa `raw.ice` | thay bằng `DEFAULTS.ice` |
| V6 | `Array.isArray(raw.toppings)` | thay bằng `[]` |
| V7 | mỗi phần tử: `findTopping(id)` tồn tại | bỏ phần tử đó |
| V8 | khử trùng lặp topping (giữ lần xuất hiện đầu) | — |
| V9 | `toppings.length > MAX_TOPPINGS` | cắt còn `MAX_TOPPINGS` theo thứ tự catalog |
| V10 | `Number.isFinite(raw.quantity) && raw.quantity > 0` | trả `null`; ngược lại `quantity = Math.min(Math.floor(q), MAX_QTY)` |
| V11 | gán lại `key = makeConfigKey(...)` từ dữ liệu **đã chuẩn hoá** | luôn chạy, kể cả khi `key` lưu sẵn có vẻ đúng |

**Hệ quả của V2:** món bị xoá khỏi menu sẽ tự rơi khỏi giỏ ở lần nạp kế tiếp, không để lại dòng mồ côi. Đây là hành vi đã có ở `loadCart()` hiện tại và phải được giữ.

### 5.2 Validation ở tầng UI (trước khi ghi)

| # | Quy tắc | Cách thể hiện |
|---|---|---|
| U1 | Size / Đường / Đá là bắt buộc, nhưng **luôn có mặc định được chọn sẵn** ⇒ không tồn tại trạng thái "chưa chọn" để báo lỗi | Không cần `aria-invalid`; `<legend>` có nhãn chữ "Bắt buộc" |
| U2 | Tối đa 3 topping | Checkbox thứ 4 trở đi ở trạng thái `disabled` + `aria-disabled="true"` + mô tả `aria-describedby` tới dòng "Chọn tối đa 3 loại" |
| U3 | `quantity ∈ [1, 20]` | Nút `−` `disabled` ở `1`, `+` `disabled` ở `20`; cả hai **vẫn đọc được** bởi screen reader qua `aria-label` |
| U4 | Không thể thêm khi `cart.items.length >= 20` dòng | Nút CTA `disabled` + thông báo trong vùng `role="status"`. Đây là chặn kỹ thuật để giỏ không phình vô hạn, không phải chính sách kinh doanh |
| U5 | Mọi phụ thu hiển thị phải kèm "minh hoạ" | Nhãn `+6.000 ₫ minh hoạ` trên chip Size L; dòng disclaimer ở chân hộp thoại; dòng disclaimer trong `#cart-summary` đã có |

### 5.3 Migration từ dữ liệu cũ

```
loadCart():
  1. thử đọc STORAGE_KEY_V2
     - nếu parse được và có { version: 2, items: [...] } → normalize từng dòng → dùng
  2. nếu không có v2, thử đọc STORAGE_KEY_LEGACY (dạng phẳng { "brown-sugar": 2 })
     - với mỗi cặp id → quantity hợp lệ: tạo bản ghi DEFAULTS (Size M, 50% đường, 70% đá, không topping)
     - quantity = min(floor(q), MAX_QTY); bỏ qua id không có trong PRODUCTS
  3. ghi kết quả vào v2 (bọc try/catch)
  4. nếu đã migrate từ legacy → removeItem(STORAGE_KEY_LEGACY) (bọc try/catch)
  5. mọi lỗi ở bất kỳ bước nào ⇒ trả { version: 2, items: [] } và KHÔNG ném
```

Điểm bắt buộc: **`step 4` chỉ chạy sau khi `step 3` ghi thành công.** Nếu ghi v2 thất bại (private mode/quota), giữ nguyên legacy để lần sau còn migrate lại; nếu đã xoá legacy mà ghi v2 lỗi thì dữ liệu người dùng mất.

---

## 6. Accessibility

### 6.1 Cấu trúc ngữ nghĩa

```html
<div class="custom-backdrop" data-close-custom aria-hidden="true"></div>
<div class="custom-dialog" id="custom-dialog"
     role="dialog" aria-modal="true"
     aria-labelledby="custom-title"
     aria-describedby="custom-desc"
     aria-hidden="true" tabindex="-1">
  <div class="custom-header"> … eyebrow + <h2 id="custom-title"> + nút đóng … </div>
  <p id="custom-desc" class="visually-hidden">
    Tùy chỉnh độ ngọt, đá và thêm topping yêu thích. Mọi phụ thu là giá minh hoạ.
  </p>
  <div class="custom-body">
    <fieldset class="option-group"> <legend>Kích cỡ ly <span class="legend-badge">Bắt buộc</span></legend> … </fieldset>
    <fieldset class="option-group"> <legend>Độ ngọt <span class="legend-badge">Bắt buộc</span></legend> … </fieldset>
    <fieldset class="option-group"> <legend>Lượng đá <span class="legend-badge">Bắt buộc</span></legend> … </fieldset>
    <fieldset class="option-group" aria-describedby="topping-hint">
      <legend>Topping thêm vui</legend>
      <p id="topping-hint" class="option-hint">Chọn tối đa 3 loại (không bắt buộc)</p> …
    </fieldset>
  </div>
  <div class="custom-footer"> … stepper + CTA + disclaimer … </div>
</div>
```

Quyết định:
- **Không** `<dialog>`, **không** `method="dialog"`, **không** `showModal()` (DES-C02, DES-C03).
- Một `<h2>` duy nhất trong dialog, dùng làm `aria-labelledby`.
- `aria-describedby` trỏ tới dòng hướng dẫn ổn định, **không** trỏ tới mô tả marketing của món (DES-C13).
- Mỗi nhóm là `<fieldset>` + `<legend>` thật ⇒ screen reader đọc được tên nhóm khi vào từng radio.
- Vùng `role="status"` (`#custom-status`) là **nơi duy nhất** phát thông báo thay đổi, và chỉ phát câu tổng hợp hoàn chỉnh sau khi người dùng dừng thao tác (DES-C09).

### 6.2 Luồng bàn phím

| Phím | Hành vi |
|---|---|
| `Tab` | Đi tuần tự: nút đóng → nhóm Size → Đường → Đá → Topping → nút `−` → nút `+` → CTA → quay lại nút đóng. Việc "nhốt" đến từ `inert` trên landmark ngoài, **không** từ key trap thủ công |
| `Shift+Tab` | Ngược lại cùng vòng |
| `←` `→` `↑` `↓` | Trong một nhóm radio: chuyển và **chọn luôn** mức kế/trước (roving tabindex theo WAI-ARIA Radio Group). Không có wrap-around ngoài nhóm |
| `Space` | Bật/tắt topping đang focus. Không toggle hai lần (xem E-06) |
| `Enter` | Chỉ nút CTA mới thực thi thêm vào giỏ. Enter ở radio/checkbox **không** được submit gì (đã bỏ `<form>`) |
| `Escape` | Đóng, huỷ bản nháp, trả focus về nút `+` đã mở. Nếu `lastFocused` đã bị gỡ khỏi DOM thì trả về `[data-open-cart]` |
| `Home` / `End` | Không bắt buộc. Nếu hiện thực thì phải trong cùng nhóm radio |
| Cuộn | `.custom-body` là vùng cuộn duy nhất (`overflow-y: auto`, `overscroll-behavior: contain`); footer không co lại; `body { overflow: hidden }` khi `custom-open` |

**Điểm dừng focus đầu tiên:** radio của Size đang được chọn (mặc định Size M), **không** phải nút đóng — để người dùng bàn phím vào thẳng việc chính. Nút đóng vẫn nằm trong vòng Tab.

### 6.3 Focus indicator

`styles.css:189–194` khai `:focus-visible` với `border-radius: var(--radius-sm)` và `box-shadow` halo, cùng specificity `(0,1,0)` như một class đơn. Vì vậy:

- Mọi quy tắc focus mới của hộp thoại **phải đặt sau dòng 194**.
- Focus phải được vẽ trên **phần tử hiển thị** (`.chip-content`, `.pill-chip > span`, `.topping-item`), không trên input đã bị ẩn thị giác.
- Nút tròn (`.icon-button`, stepper) phải khai lại `border-radius: 50%` trong quy tắc focus của chính nó, nếu không halo sẽ bo vuông 10px.
- Hộp thoại có nền `--cream` ở footer và `--paper` ở thân ⇒ **không** nằm trong danh sách ngoại lệ halo tối ở dòng 197–199. Halo sáng `rgba(255,250,240,.95)` là đúng ở đây; phải đo lại viền focus trên cả hai nền.

### 6.4 Ngưỡng phải đo lại (không kế thừa)

| Hạng mục | Ngưỡng | Trạng thái |
|---|---|---|
| Chữ chip chưa chọn: `--plum` trên `#fff` | ≥ 4,5:1 | **Chưa đo** |
| Chữ chip đã chọn: `#fff` trên `--plum` | ≥ 4,5:1 | **Chưa đo** (nhưng `--plum` trên kem đã đo 12,3:1 nên gần như chắc chắn đạt) |
| Nhãn "minh hoạ" / giá phụ thu trên nền hàng | ≥ 4,5:1 | **Chưa đo** — quyết định §2.2 DES-C04 |
| Viền control chưa chọn `--line-strong` trên `#fff` | ≥ 3:1 | **Chưa đo trên `#fff`** (đã đo 4,55:1 trên nền khác) |
| Viền focus `--focus-ring` trên paper **và** trên cream | ≥ 3:1 | Đã đo 16,80:1 trên paper; **chưa đo trên cream** |
| Viền nút disabled (nếu hạ opacity) | ≥ 3:1 | **Chưa đo** — xem DES-C15 |
| Vùng chạm mọi control | ≥ 44×44px | **Chưa đo** |
| Khoảng cách giữa hai vùng chạm liền kề | ≥ 8px | **Chưa đo** |
| `scrollHeight === clientHeight` cho mọi nhãn chip tiếng Việt | delta = 0 hoặc ≤ 1px sub-pixel | **Chưa đo** — rủi ro dấu tiếng Việt (REV-02 là tiền lệ) |

---

## 7. Edge cases

Mỗi mục có **quyết định chốt**. Khi mâu thuẫn với DES-002, mục này thắng.

| ID | Tình huống | Quyết định |
|---|---|---|
| **E-01** | Người dùng thêm `Đường Đen (L, 50%, 70%, trân châu)` **hai lần** từ hai lần mở hộp thoại | Cùng `configKey` ⇒ **cộng dồn số lượng vào một dòng**. Không tạo hai dòng giống hệt nhau |
| **E-02** | Thêm `Đường Đen (M, 50%, 70%)` rồi `Đường Đen (L, 50%, 70%)` | Hai `configKey` khác nhau ⇒ **hai dòng riêng**, mỗi dòng có giá riêng và stepper riêng. Đây chính là yêu cầu cốt lõi |
| **E-03** | Hai cấu hình chỉ khác **thứ tự bấm topping** (`pearls` rồi `mochi` vs `mochi` rồi `pearls`) | Sắp xếp ⇒ **cùng** `configKey` ⇒ một dòng. Bắt buộc, nếu không giỏ sẽ có dòng trùng vô nghĩa |
| **E-04** | Topping id chứa `-` hoặc `__` | **Cấm** ở tầng dữ liệu. Thêm assert trong `makeConfigKey` (chỉ ở chế độ dev, không log ra production) |
| **E-05** | `localStorage` chứa `unitPrice` giả (ví dụ 1₫) | `unitPrice` không được lưu (§3.3), và `normalizeRecord` bỏ qua mọi trường giá. Giá luôn tính lại ⇒ tấn công vô hiệu |
| **E-06** | Bấm vào hàng topping (không bấm trực tiếp vào input) | `<label>` bao `<input>` ⇒ trình duyệt tự chuyển click thành toggle. Handler **chỉ** đọc `event.target.closest("input")` sau khi sự kiện đã hoàn tất, hoặc lắng nghe `change` thay vì `click`. **Chốt: dùng `change`.** Không xử lý `click` trên label ⇒ không double-toggle |
| **E-07** | Bấm `+` khi drawer đang mở | `openCustomization()` gọi `closeCart()` trước ⇒ giữ bất biến một-overlay |
| **E-08** | Trong hộp thoại, bấm "Mở giỏ hàng" | `closeCustomization()` trước, `openCart()` sau |
| **E-09** | Escape khi **không** có overlay nào mở | Không làm gì. Handler phải kiểm tra class trước, đúng như `app.js:546` hiện tại |
| **E-10** | Escape khi cả hai overlay cùng mở (trạng thái bất hợp lệ do lỗi) | Đóng **cả hai**, đưa về `IDLE`. Hành vi phòng thủ: người dùng không bao giờ bị kẹt |
| **E-11** | Người dùng chọn 3 topping rồi bỏ 1 | Các topping còn lại phải **được bật lại** và bỏ `aria-disabled`. `syncToppingLimit()` chạy ở cả hai chiều |
| **E-12** | Đang ở Size L, bấm nút `−` xuống 1 | Nút `−` `disabled`; CTA vẫn hiện giá của 1 ly, không về 0 |
| **E-13** | Số lượng trong hộp thoại = 20, bấm `+` | Nút `+` `disabled`, không tăng, không có thông báo lỗi ồn ào |
| **E-14** | Món bị xoá khỏi `PRODUCTS` trong khi `localStorage` còn dòng của nó | V2 trong `normalizeRecord` ⇒ dòng bị bỏ, giỏ vẫn render bình thường |
| **E-15** | `localStorage` bị chặn hoàn toàn (private mode) | Đọc trả `{ items: [] }`; ghi thất bại im lặng; **giỏ vẫn dùng được trong phiên hiện tại** (giữ đúng hành vi `saveCart()` hiện tại) |
| **E-16** | `localStorage` chứa JSON hỏng / mảng / chuỗi | `try/catch` + kiểm tra kiểu ⇒ giỏ rỗng, **menu vẫn render**. Không được để lỗi này làm trắng menu (tiền lệ QA2-02) |
| **E-17** | Giỏ có 20 dòng, người dùng mở hộp thoại món mới | CTA `disabled` + thông báo trong `#custom-status`. Hộp thoại vẫn mở để người dùng xem cấu hình |
| **E-18** | Người dùng chỉnh số lượng trong hộp thoại rồi Escape | **Huỷ toàn bộ**, kể cả số lượng. Không có "lưu nháp" |
| **E-19** | Giỏ đang có dòng `brown-sugar__M__50__70__none` (từ migration), người dùng thêm đúng cấu hình đó | Cùng `configKey` ⇒ cộng dồn. Migration và luồng mới phải dùng **cùng** hàm `makeConfigKey` |
| **E-20** | `MAX_QTY` đạt tới khi cộng dồn (dòng có 18, thêm 5 từ hộp thoại) | Kẹp ở `MAX_QTY`, số dư bị bỏ. Không tạo dòng thứ hai, không báo lỗi |
| **E-21** | Tiêu điểm đang ở radio Size, người dùng resize qua mốc 720px | Layout đổi, `state` giữ nguyên, focus **không** bị mất (không render lại DOM hộp thoại khi resize) |
| **E-22** | `prefers-reduced-motion: reduce` | Hộp thoại và backdrop hiện tức thì; không trượt, không scale, không "nảy số". Focus và giá vẫn hoạt động 100% |
| **E-23** | Toast và hộp thoại cùng lúc | **Không xảy ra**: toast chỉ phát sau khi hộp thoại đã đóng (B5). Vì vậy không cần đụng vào cơ chế `--summary-h` (`app.js:559–569`) |
| **E-24** | Nút `+` trên thẻ món bị bấm liên tiếp rất nhanh | Mỗi lần bấm mở lại hộp thoại với `DEFAULTS`; lần mở sau ghi đè `lastFocused`. Không có hàng đợi, không có trạng thái trung gian |
| **E-25** | Topping có `price: 0` | Hợp lệ. Giá hiển thị `+0 ₫` hoặc ẩn phần giá; tổng vẫn đúng. Không có nhánh đặc biệt |
| **E-26** | Ở 320px, chip Đường (5 chip) xuống 3 dòng | **Chấp nhận.** `.custom-body` cuộn dọc. Tuyệt đối không thêm `overflow-x: auto` (DES-R03) |
| **E-27** | Người dùng bấm backdrop để đóng | Hợp lệ, tương đương Escape: huỷ bản nháp, trả focus. Backdrop **không** nhận focus |
| **E-28** | `#copy-order` khi giỏ rỗng | Vẫn là no-op như hiện tại (`app.js:494`), không đổi |

---

## 8. Minh bạch giá

### 8.1 Nơi phải hiển thị

| Vị trí | Nội dung | Ghi chú |
|---|---|---|
| Chip Size L | `500ml · +6.000 ₫ minh hoạ` | Từ "minh hoạ" nằm **cạnh con số**, không chỉ ở disclaimer |
| Mỗi hàng topping | `+5.000 ₫` v.v. | Kèm dòng hint chung `"Phụ thu topping là giá minh hoạ"` trong `#topping-hint` |
| Chân hộp thoại | `Đơn giá: 51.000 ₫` + dòng `Giá và phụ thu topping là nội dung minh hoạ cho bản thử nghiệm.` | Không viết tắt, không ẩn sau tooltip |
| Nút CTA | `Thêm vào giỏ · 51.000 ₫` | Số này là `unitPrice × quantity` |
| Dòng giỏ hàng | `56.000 ₫ / ly` (đơn giá đã gồm phụ thu) | **Không** hiển thị giá gốc trần khi dòng có phụ thu |
| `#cart-summary` | Giữ nguyên dòng disclaimer hiện có | `app.js` đã có |
| Văn bản copy | `Tổng tạm tính: …` + câu ghi chú minh hoạ cuối | §9 |

### 8.2 Quy tắc

- **Không** dùng chữ "miễn phí" cho Size M hay mức đường/đá `0 ₫`. Ghi `+0 ₫` là dễ hiểu sai; tốt hơn là **không hiển thị gì** cho mức không phụ thu.
- **Không** cộng phụ thu vào giá món ở thẻ menu. Thẻ menu vẫn là giá cơ bản — đúng như hiện tại và đúng như `note-tag` ở `index.html:112`.
- **Không** hiển thị tổng tiền ở đâu mà không kèm bối cảnh "minh hoạ" ở gần đó (chân hộp thoại, hoặc `#cart-summary`).
- Con số phải dùng `Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 })` — **dùng lại** `CURRENCY` sẵn có ở `app.js:96`, không tạo formatter thứ hai.
- Mọi con số tiền phải có `font-variant-numeric: tabular-nums` để không nhảy chiều rộng khi cập nhật — `styles.css` đã dùng ở `.cart-item-sub`, `.cart-item-qty`, `.cart-total-row strong`.

---

## 9. Định dạng sao chép đơn

Giữ nguyên khung hiện tại (`app.js:501–511`) và chỉ mở rộng dòng món, để không phá vỡ thói quen người dùng:

```text
Đơn DuDu (bản thử)

- 1 × Sữa Tươi Trân Châu Đường Đen (Size L, 50% đường, 70% đá, thêm: Trân châu dẻo đường đen): 56.000 ₫
- 2 × Oolong Sữa Nướng (Size M, 50% đường, 70% đá): 84.000 ₫
- 1 × Trà Đào Cam Sả (Size L, 70% đường, 100% đá, thêm: Thạch củ năng bùi giòn): 51.000 ₫

Tổng tạm tính: 191.000 ₫
Ghi chú: đơn minh hoạ cho bản thử nghiệm, vui lòng xác nhận giá và kênh nhận đơn chính thức với DuDu.
```

Quy tắc:
- Không topping ⇒ **bỏ hẳn** mệnh đề `, thêm: …`, không ghi `thêm: không`.
- Nhiều topping ⇒ nối bằng `, ` theo **thứ tự catalog** (không theo thứ tự bấm), để cùng một cấu hình luôn cho cùng một chuỗi.
- Đơn giá trong ngoặc là giá **của một ly**; số ở cuối là **thành tiền của dòng** (`unit × qty`).
- Câu kết luôn nói rõ đây là đơn minh hoạ. **Không** câu nào được ngụ ý đơn đã được gửi.

---

## 10. Task split

Quy ước: mỗi tập tin **một** người sở hữu trong một phase (`AGENTS.md` rule 1). Tất cả task dưới đây là **đề xuất** — chưa được ghi vào `TASKS.md` (theo yêu cầu của người dùng ở phiên này).

### 10.1 Bảng task

| ID | Owner | Deliverable | Tập tin | Phụ thuộc | Tiêu chí nghiệm thu |
|---|---|---|---|---|---|
| **UX-202** | Antigravity | Hiệu chỉnh `customization-visual-spec.md` theo §2.2 (DES-C01…C15) + §2.3 (DES-R01…R05): bỏ `<dialog>`, bỏ form submit, sửa focus visually-hidden, sửa màu giá topping, bỏ emoji, một cột ở mọi viewport, bỏ scroll-snap ngang | `docs/reviews/customization-visual-spec.md` | — | Mọi mục DES-C và DES-R được xử lý hoặc có lý do bác bỏ bằng văn bản; **không** sửa `dist/` |
| **PM-002** | DeepSeek | Tài liệu này | `docs/reviews/customization-product-plan.md` | — | Đã xong |
| **FE-101** | Codex | Khung HTML hộp thoại tùy chỉnh (semantic shell) trong `index.html`: backdrop, `role="dialog"`, header + `h2` + nút đóng 44px, 4 `fieldset`+`legend`, `#custom-status`, footer stepper + CTA + disclaimer. Mọi chip/ô topping viết tĩnh đúng bảng hằng số §3.1 | `dist/index.html` | — | HTML hợp lệ; `role`/`aria-*` đúng §6.1; **không** JS nào chạy vẫn thấy cấu trúc đúng; nút đóng 44×44px |
| **FE-102** | Codex | Tầng dữ liệu & model: bảng hằng số, `makeConfigKey`, `unitPriceOf`, `lineTotalOf`, `cartTotalOf`, `cartCountOf`, `describeConfig`, `normalizeRecord`, `mergeIntoCart`; `loadCart()` v2 + migrate + `removeItem` legacy; `saveCart()` bọc `try/catch` | `dist/app.js` | FE-101 | Hàm thuần không chạm DOM; `key` canonical (§3.2); dữ liệu hỏng ⇒ giỏ rỗng, menu vẫn render (E-16); migrate đúng §5.3 |
| **FE-103** | Codex | Controller hộp thoại: `openCustomization`, `closeCustomization`, `collectCustomization`, `syncToppingLimit`, `updateDraftPrice`, `changeDraftQty`, gắn `change` **và** `click` đúng cách, xử lý `Escape`, ép reflow, `inert`, bất biến một-overlay (§4.1) | `dist/app.js` | FE-102 | B1–B8 đúng; E-06/E-07/E-08/E-10/E-11 đúng; focus vào radio Size đang chọn; Escape trả focus |
| **FE-104** | Codex | Giỏ hàng theo cấu hình: `cartRow()` render pill Size + dòng thông số + dòng topping + đơn giá đã gồm phụ thu; stepper dùng `key`; `renderCart(focusTarget)` khớp theo `key` | `dist/app.js` | FE-102 | E-01/E-02/E-03 đúng; E-02 hiển thị **hai dòng riêng**; focus không mất sau `+`/`−` (giữ hành vi QA2-03) |
| **FE-105** | Codex | CSS hộp thoại: backdrop, bottom-sheet <720px / dialog ≥720px, chip radio, hàng topping, stepper, footer dính, disclaimer, `:focus-visible` đặt **sau** dòng 194, `[hidden]` không bị `display:flex` ghi đè, reduced-motion | `dist/styles.css` | FE-101 | Đo: 0 tràn ngang ở 5 viewport; mọi control ≥44×44px; focus ring ≥3:1 trên paper **và** cream; chữ ≥4,5:1; `scrollHeight−clientHeight ≤ 1px` cho mọi nhãn chip |
| **FE-106** | Codex | Văn bản copy + toast: mở rộng dòng món với `describeConfig()` và `Tổng tạm tính`; toast chỉ sau khi hộp thoại đóng; thông báo trong `#custom-status` | `dist/app.js` | FE-104 | Định dạng khớp §9; không có câu ngụ ý đã gửi đơn; toast không bao giờ phát khi hộp thoại mở |
| **QA-201** | DeepSeek | Harness hồi quy mới T12–T20 (mở rộng bộ hiện có, **không** thay T1–T11) | `test.mjs` (hoặc tập tin harness hiện hành) | FE-101…FE-106 | T12–T20 pass; T1–T11 vẫn pass; tổng mới ghi rõ |
| **QA-202** | Antigravity | Đo & review thị giác bản build có customization trên 5 viewport; xác nhận hoặc bác bỏ từng ngưỡng ở §6.4 bằng số | `docs/reviews/antigravity-customization-review.md` (mới) | FE-105, QA-201 | **0 High, 0 Medium**; mỗi finding có số đo + cách kiểm chứng lại; **không** sửa `dist/` |
| **BIZ-003** | Human owner | Xác nhận size L, danh mục topping, mức phụ thu, preset ngọt/đá | — | — | Có quyết định bằng văn bản; tới lúc đó UI giữ nhãn "minh hoạ" |

### 10.2 Thứ tự thực thi

```
Phase A  FE-101 ──────────────► FE-105        (shell + CSS, không phụ thuộc JS)
Phase B  FE-102 ──► FE-103 ──► FE-106         (model → controller → copy/toast)
                  └► FE-104
Phase C  QA-201 ──► QA-202                    (harness → review thị giác)
Song song UX-202 (Antigravity, độc lập, chỉ sửa docs/)
BIZ-003 không chặn code
```

### 10.3 Ranh giới sở hữu tập tin (bắt buộc)

| Tập tin | Người sở hữu | Người **không** được sửa |
|---|---|---|
| `dist/index.html`, `dist/styles.css`, `dist/app.js` | **Codex** | DeepSeek, Antigravity |
| `docs/reviews/customization-visual-spec.md` | **Antigravity** | Codex, DeepSeek |
| `docs/reviews/customization-product-plan.md` | **DeepSeek** | Codex, Antigravity |
| `docs/reviews/antigravity-customization-review.md` | **Antigravity** | Codex, DeepSeek |
| `docs/design-spec.md` | **Antigravity** | Codex, DeepSeek |
| `TASKS.md` | người quyết định bảng (không thuộc phiên này) | — |

**Quan trọng — Codex không sửa `customization-visual-spec.md`.** Nếu Codex phát hiện đặc tả sai, Codex ghi lại thành một finding trong báo cáo của mình và **DeepSeek** phân loại; Antigravity sửa đặc tả. Không được âm thầm viết lại bàn giao của người khác (`AGENTS.md` rule 8).

---

## 11. Regression tests (T12–T20)

Mở rộng bộ 55 ca hiện có. **Không** đổi tên hay thay thế T1–T11; bổ sung T12–T20 và ghi tổng mới dạng `NN/NN PASS`.

| ID | Ca kiểm thử | Tiêu chí đạt |
|---|---|---|
| **T12.1** | `+` trên thẻ món mở hộp thoại đúng món | `#custom-title` = tên món; Size M / 50% / 70% / 0 topping được chọn sẵn |
| **T12.2** | Bấm `+` khi drawer đang mở | `body` **không** còn `drawer-open`; có `custom-open`; `inert` gồm `.cart-drawer` |
| **T12.3** | Bấm "Mở giỏ hàng" trong hộp thoại | `custom-open` đã bị gỡ **trước**; `drawer-open` có; `.cart-drawer` **không** còn `inert` |
| **T13.1** | 6 món × chọn Size L | Đơn giá = `price + 6000` cho từng món (kiểm cả 6) |
| **T13.2** | Chọn từng topping một | Đơn giá tăng đúng 5.000 / 5.000 / 6.000 / 10.000 / 8.000 |
| **T13.3** | Chọn cả 3 topping đắt nhất | Đơn giá = `base + size + 24.000`; tổng ở CTA = `unit × qty` |
| **T13.4** | `qty = 2` với `brown-sugar (L, 50, 70, pearls)` | 45.000 + 6.000 + 5.000 = 56.000 ⇒ CTA hiện `112.000 ₫`; tổng giỏ = `112.000 ₫` |
| **T13.5** | Không chọn topping | Chuỗi cấu hình **không** chứa `thêm:` |
| **T14.1** | Thêm `brown-sugar (M,50,70,none)` rồi `(L,50,70,none)` | **2 dòng** riêng trong `#cart-items`; tổng = 45.000 + 51.000 = 96.000 |
| **T14.2** | Thêm **cùng** cấu hình 2 lần | **1 dòng**, `quantity = 2`; badge = 2 |
| **T14.3** | Thêm `(M,50,70,[pearls,mochi])` rồi `(M,50,70,[mochi,pearls])` | **1 dòng** (sắp xếp canonical); badge = 2 |
| **T14.4** | `−` xuống 0 trên dòng 1 | Dòng biến mất; dòng còn lại giữ nguyên thứ tự |
| **T15.1** | Thêm 2 dòng, reload | Cả 2 dòng trở lại đúng cấu hình, đúng số lượng, đúng giá |
| **T15.2** | Seed `dudu-cart` = `{"brown-sugar":2,"oolong":1}`, xoá v2, reload | Migrate thành 2 dòng Size M/50/70/không topping; badge = 3; tổng = 2×45.000 + 42.000 = 132.000; **khoá legacy đã bị xoá** |
| **T15.3** | Seed `dudu-cart` = `{{{` | Giỏ rỗng, **menu vẫn render đủ 6 thẻ**, không lỗi console |
| **T15.4** | Seed `dudu-cart` = `[]` và `"abc"` và `null` | Cả ba ⇒ giỏ rỗng, không lỗi |
| **T15.5** | Seed v2 có `toppings:["pearls","pearls","mochi"]` và `size:"XL"` và `sugar:33` | Chuẩn hoá: topping khử trùng lặp, `size` về `M`, `sugar` về `50` |
| **T15.6** | Seed v2 có `quantity: 999` | Kẹp ở `MAX_QTY` (20) |
| **T15.7** | Seed v2 có `productId:"khong-ton-tai"` | Dòng bị bỏ; giỏ render bình thường |
| **T16.1** | Mở hộp thoại bằng Enter trên nút `+` | `document.activeElement` là radio Size M |
| **T16.2** | Tab 12 lần từ đầu | Focus **không** bao giờ rời khỏi `.custom-dialog` |
| **T16.3** | `ArrowRight` trong nhóm Đường | Mức kế được chọn; `document.activeElement` đổi trong cùng nhóm |
| **T16.4** | Space trên hàng topping | Topping được chọn **đúng một lần** (không double-toggle) |
| **T16.5** | Escape | `custom-open` bị gỡ; focus về đúng nút `+` đã mở |
| **T16.6** | `.custom-dialog` khi đóng | `aria-hidden="true"`; không control nào nhận được focus |
| **T16.7** | `aria-modal`, `role="dialog"`, `aria-labelledby` trỏ tới `h2` tồn tại | Cả ba đúng |
| **T17.1** | Chọn 3 topping | Topping thứ 4, 5 có `disabled` **và** `aria-disabled="true"` |
| **T17.2** | Bỏ 1 trong 3 topping | Topping thứ 4, 5 **được bật lại** |
| **T17.3** | Cố click topping đang `disabled` | `toppings` không đổi; giá không đổi |
| **T17.4** | `qty = 1` | Nút `−` `disabled`; viền nút vẫn đo được ≥ 3:1 |
| **T18.1** | Copy với 3 dòng cấu hình khác nhau | Chuỗi khớp §9: có Size/đường/đá/topping, có `Tổng tạm tính`, có câu ghi chú minh hoạ |
| **T18.2** | Copy với dòng không topping | Không chứa `thêm:` |
| **T18.3** | Quét toàn văn bản copy | Không có `đã gửi`, `đặt hàng thành công`, `xác nhận đơn`, số điện thoại, hotline |
| **T19.1** | Quét DOM của hộp thoại | Mọi con số phụ thu có từ "minh hoạ" trong bán kính cùng nhóm hoặc trong `#custom-desc`/disclaimer |
| **T19.2** | Quét `dist/` | Không có hotline/địa chỉ/số điện thoại mới; `hasPhoneNumber: false` |
| **T19.3** | Quét DOM | Không có chuỗi ngụ ý đơn đã gửi |
| **T20.1** | Reduced motion | `.custom-dialog` / `.custom-backdrop` `transition-duration` = `0.01ms`; `transform: none`; hộp thoại vẫn mở/đóng/chọn được |
| **T20.2** | 5 viewport: 320/390/768/1024/1440 | `documentElement.scrollWidth === clientWidth` ở cả 5; không phần tử nào có `getBoundingClientRect().right > clientWidth` |
| **T20.3** | 5 viewport | Mọi control trong hộp thoại ≥ 44×44px |
| **T20.4** | 5 viewport | `scrollHeight − clientHeight ≤ 1` cho mọi nhãn chip và nhãn legend |
| **T20.5** | Console | 0 lỗi JS sau toàn bộ luồng |

**Ghi chú kỹ thuật cho QA-201:** T20.2 phải đo theo đúng bài học QA2-05 — **không** dùng "không có thanh cuộn" làm bằng chứng, vì `styles.css:30` đặt `overflow-x: hidden` trên `body`. Phải so `scrollWidth` với `clientWidth` **và** kiểm `getBoundingClientRect().right` của từng phần tử.

---

## 12. Acceptance criteria

### 12.1 Tiêu chí chức năng

| Mã | Tiêu chí | Cách đo |
|---|---|---|
| **AC-P01** | Mọi nút `+` trên thẻ món mở hộp thoại tùy chỉnh thay vì thêm thẳng | 6/6 thẻ; `#custom-title` đúng tên món |
| **AC-P02** | Người dùng chọn được Size, Đường, Đá, Topping trước khi thêm | 4 `fieldset` hiện diện, có `legend`; mọi mức chọn được |
| **AC-P03** | Hai cấu hình khác nhau của cùng một món là **hai dòng** trong giỏ | Test T14.1: 2 dòng, 2 đơn giá, 2 stepper |
| **AC-P04** | Cùng cấu hình thêm hai lần ⇒ **một dòng**, số lượng cộng dồn | Test T14.2, T14.3 |
| **AC-P05** | Đơn giá = giá gốc + phụ thu size + Σ phụ thu topping; thành tiền = đơn giá × số lượng | Test T13.1–T13.4; sai số 0 đồng |
| **AC-P06** | Mỗi phụ thu hiển thị kèm nhãn "minh hoạ" ở nơi người dùng nhìn thấy | Test T19.1 |
| **AC-P07** | Giỏ persist qua reload, gồm cấu hình | Test T15.1 |
| **AC-P08** | Dữ liệu phẳng cũ được migrate sang cấu hình mặc định | Test T15.2 |
| **AC-P09** | Văn bản copy có Size, % đường, % đá, tên topping, đơn giá và tổng | Test T18.1, T18.2 |
| **AC-P10** | Không có câu nào ngụ ý đơn đã được gửi | Test T18.3, T19.3 |
| **AC-P11** | Escape huỷ bản nháp và trả focus về nút đã mở | Test T16.5 |
| **AC-P12** | Không bao giờ có hai overlay cùng mở | Test T12.2, T12.3 |

### 12.2 Tiêu chí phi chức năng

| Mã | Tiêu chí | Ngưỡng | Trạng thái |
|---|---|---|---|
| **AC-P13** | Không tràn ngang | `scrollWidth === clientWidth` tại 320/390/768/1024/1440; 0 phần tử vượt mép | Chưa đo |
| **AC-P14** | Vùng chạm | Mọi control trong hộp thoại ≥ 44×44px; khoảng cách ≥ 8px | Chưa đo |
| **AC-P15** | Tương phản chữ | ≥ 4,5:1 (nhỏ), ≥ 3:1 (lớn) cho mọi nhãn chip, giá, legend, disclaimer | Chưa đo |
| **AC-P16** | Tương phản viền control | ≥ 3:1 cho viền chip chưa chọn, hộp kiểm, viền nút `disabled` | Chưa đo |
| **AC-P17** | Focus ring | ≥ 3:1 trên **cả** nền paper và cream; không bị `border-radius` của dòng 194 bóp méo | Chưa đo |
| **AC-P18** | Dấu tiếng Việt không tràn hộp dòng | `scrollHeight − clientHeight ≤ 1px` cho mọi nhãn chip | Chưa đo |
| **AC-P19** | Reduced motion | Transition/animation = `0.01ms`; `transform: none`; chức năng không đổi | Chưa đo |
| **AC-P20** | Hồi quy | T1–T11 vẫn pass; tổng mới `NN/NN PASS` với 0 fail | Chưa chạy |
| **AC-P21** | Console | 0 lỗi JS sau mọi luồng | Chưa đo |
| **AC-P22** | Không sửa ngoài phạm vi | `git diff` chỉ chạm `dist/index.html`, `dist/styles.css`, `dist/app.js`, harness, và `docs/reviews/` | Chưa kiểm |

### 12.3 Điều kiện dừng vòng lặp fix → review

Đúng như tiền lệ Phase 6 (`TASKS.md` §Vòng lặp): vòng review dừng khi **0 High và 0 Medium**. Finding Low được ghi nhận và sửa nếu rẻ, nhưng không chặn đóng iteration.

---

## 13. Rủi ro

| ID | Rủi ro | Mức | Giảm thiểu |
|---|---|---|---|
| R-01 | Nút `+` trên thẻ món đổi ngữ nghĩa (mở hộp thoại thay vì thêm thẳng) làm chậm thao tác quen thuộc | Trung bình | Giữ nguyên kiểu dáng nút tròn 44px, chỉ đổi hành vi; nhãn `aria-label` phải nói rõ "Tùy chỉnh …". Nút CTA trong hộp thoại là đường một-bước-hoàn-tất nhanh nhất có thể |
| R-02 | Hộp thoại có 4 nhóm làm thẻ món trở nên "nặng" với người chỉ muốn uống nhanh | Trung bình | Mặc định đã chọn sẵn (M/50/70/không topping) ⇒ 1 lần bấm CTA là xong. Không thêm bước xác nhận nào |
| R-03 | Chip dài ở 320px tạo tràn ngang | Cao | Cấm `overflow-x: auto` (DES-R03); dùng `grid` + `flex-wrap`; test T20.2 đo bằng `getBoundingClientRect` |
| R-04 | Hai overlay cùng mở do lỗi thứ tự gọi hàm | Cao | Bất biến §4.1 + test T12.2/T12.3 + phòng thủ E-10 |
| R-05 | Dấu tiếng Việt tràn hộp dòng trong chip nhỏ | Trung bình | `line-height ≥ 1,2` cho mọi nhãn chip; test T20.4 (tiền lệ REV-02) |
| R-06 | Màu `--pink-ink` dùng trên nền `#fff` mà chưa đo | Trung bình | DES-C04: chốt dùng `--muted`/`--plum-deep`, hoặc đổi nền sang paper/cream |
| R-07 | Roving tabindex cho radio nhóm bị hiện thực nửa vời (mũi tên không đổi focus, hoặc wrap ra ngoài nhóm) | Trung bình | Test T16.3; nếu không kịp, để **radio gốc** hoạt động theo mặc định trình duyệt (không roving) — vẫn đạt WCAG, chỉ kém mượt |
| R-08 | `MAX_QTY`/`MAX_ITEMS` gây khó chịu mà không có lý do nghiệp vụ | Thấp | Ghi rõ trong mã là chặn kỹ thuật; thông báo trong `#custom-status`, không dùng hộp thoại lỗi |
| R-09 | Đặc tả DES-002 và tài liệu này lệch nhau, Codex không biết tin bên nào | Cao | §2 ghi rõ: hiệu chỉnh và bác bỏ trong tài liệu này **thắng**. Codex đọc §2 trước khi viết mã. Antigravity đồng bộ DES-002 trong UX-202 |
| R-10 | Topping catalog bị hiểu là dữ liệu thật | Trung bình | Nhãn "minh hoạ" bắt buộc; `BIZ-003` mở; không dùng từ "best-seller"/"bán chạy" cho topping |

---

## 14. Handoff cho Codex

**Task ID:** `PM-002` (kế hoạch) — chuyển giao cho `FE-101`…`FE-106` + `QA-201`.
**Files changed trong phiên này:** `docs/reviews/customization-product-plan.md` (mới). `dist/`, `TASKS.md`, `docs/design-spec.md` và mọi review khác **không bị sửa**.
**Checks run:** đọc toàn bộ nguồn ở đầu tài liệu; kiểm chứng tĩnh cấu trúc `dist/*`; đối chiếu từng mục DES-002. **Không** chạy shell, **không** chạy trình duyệt, **không** gọi Antigravity (theo yêu cầu).
**Remaining risks:** xem §13. `BIZ-003` mở. `BIZ-001`/`BIZ-002` vẫn mở từ phase trước.

### Việc của Codex, theo thứ tự

1. **Đọc `docs/reviews/customization-visual-spec.md` (UX-201) TRƯỚC**, rồi đọc §2 của tài liệu này. Ở mọi chỗ hai bên mâu thuẫn, **§2 tài liệu này thắng** — cụ thể là: không `<dialog>`/`showModal()`/`method="dialog"`; input ẩn bằng `clip-path` chứ không `opacity:0`; một class `custom-open` trên `body`; một cột ở mọi viewport; không scroll-snap ngang; bỏ emoji khỏi control; `unitPrice` không lưu vào `localStorage`; focus vẽ trên phần tử hiển thị.
2. **Giữ nguyên 8 hàm thuần ở §3.4 tách khỏi DOM.** `unitPriceOf` là **nguồn sự thật duy nhất** cho tiền. Không cộng giá ở bất kỳ chỗ nào khác.
3. **Giữ bất biến một-overlay (§4.1).** `openCustomization()` phải gọi `closeCart()` trước; "Mở giỏ hàng" trong hộp thoại phải `closeCustomization()` trước. Đây là rủi ro cao nhất (R-04).
4. **Không tin `localStorage`.** Chạy `normalizeRecord` cho mọi dòng nạp vào; luôn tính lại giá; ghi vào `dudu-cart-v2`; chỉ `removeItem("dudu-cart")` **sau khi** ghi v2 thành công.
5. **Topping dùng sự kiện `change`, không phải `click`.** `<label>` bao `<input>` sẽ forward click và gây double-toggle nếu xử lý `click` (E-06).
6. **Đặt mọi quy tắc `:focus-visible` mới SAU dòng 194 của `styles.css`.** Trước dòng đó, quy tắc focus chung sẽ ép `border-radius: 10px` và ghi đè `box-shadow` của control tròn.
7. **Chỉ `toastMessage()` sau khi hộp thoại đã đóng.** Không đụng cơ chế `--summary-h` (`app.js:559–569`) — toast chỉ phát ở trạng thái `CART` hoặc `IDLE`.
8. **Giữ T1–T11 xanh.** Mở rộng harness với T12–T20 (§11), không đổi tên ca cũ, và ghi tổng mới dạng `NN/NN PASS`.
9. **Nếu phát hiện đặc tả sai:** ghi finding + số đo, **không** tự sửa `docs/reviews/customization-visual-spec.md` hay tài liệu này. Báo lại DeepSeek để phân loại (`AGENTS.md` rule 8).
10. **Không bịa giá trị kinh doanh.** Mọi phụ thu giữ nhãn "minh hoạ" cho tới khi `BIZ-003` có quyết định bằng văn bản.

**Recommended next owner:** **Codex** (`FE-101` → `FE-102` → `FE-103`/`FE-104` → `FE-105` → `FE-106`), sau đó **DeepSeek** (`QA-201`), rồi **Antigravity** (`QA-202`). Song song, **Antigravity** chạy `UX-202` để đồng bộ `customization-visual-spec.md` với §2 — nhưng `UX-202` **không** chặn Codex, vì §2 đã là nguồn có thẩm quyền.
