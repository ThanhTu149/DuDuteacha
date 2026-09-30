# DuDu — QA tĩnh: Luồng tùy chỉnh món (QA-201)

**Task ID:** `QA-201` (DeepSeek Harness — independent QA / product lead)
**Owner của tài liệu này:** DeepSeek Harness (coordinator & QA)
**Đầu vào đã đọc trong phiên này:** `AGENTS.md`, `REQUIREMENTS.md`, `TASKS.md`, `docs/architecture.md`, `dist/index.html`, `dist/styles.css`, `dist/app.js`, `docs/reviews/customization-product-plan.md` (PM-002), `docs/reviews/customization-visual-spec.md` (UX-201 / DES-002), `docs/design-spec.md` (đối chiếu token), `docs/reviews/qa.md`, `docs/reviews/antigravity-build-review.md`.
**Đã thay đổi:** chỉ tạo mới duy nhất tập tin này. `dist/`, `TASKS.md`, `docs/design-spec.md` và mọi bàn giao khác **không bị sửa**.
**Đã tuân thủ yêu cầu phiên:** không chạy trình duyệt, không chạy git/shell phụ, không gọi subagent, không tự sửa lỗi. Mọi thao tác đọc là đọc tập tin và quét nội dung bằng công cụ tìm kiếm của harness.

> **Quy ước trạng thái dùng xuyên suốt tài liệu**
>
> | Nhãn | Nghĩa |
> |---|---|
> | **Static PASS** | Đã kiểm chứng được bằng cách đọc mã nguồn / tính toán tất định từ token. Không phải bằng chứng runtime. |
> | **Static FAIL** | Đọc mã nguồn thấy sai rõ ràng so với tiêu chí. |
> | **Browser pending** | Tiêu chí chỉ có thể đóng bằng đo/điều khiển trên trình duyệt thật (QA-202). Chưa có số đo nào được tạo ra trong phiên này. |
> | **Harness pending** | Cần bộ test chạy được (T1–T20); repo hiện không có tập tin harness. |
>
> **Không có số đo runtime nào được tuyên bố trong tài liệu này.** Các tỉ lệ tương phản nêu dưới đây được **tính lại** từ giá trị hex của token bằng công thức độ chói tương đối WCAG 2.x. Phép tính này đã được kiểm chứng chéo: nó cho đúng các mốc đã ghi trong `docs/design-spec.md` / `docs/reviews/antigravity-build-review.md` (`--focus-ring` trên paper = 16,80:1; `--muted` trên paper = 6,89:1; `--line-strong` trên paper = 4,55:1). Vì vậy chúng dùng được làm **bằng chứng tĩnh**, nhưng **không thay thế** phép đo trên render thật (font, anti-aliasing, sub-pixel).

---

## 0. Phương pháp và giới hạn

- **Đối tượng kiểm:** bản build đang có trong `dist/` tại thời điểm đọc, đối chiếu với `customization-product-plan.md` §2 (hiệu chỉnh DES-C01…C15, bác bỏ DES-R01…R05), §3–§9, T12–T20, AC-P01…AC-P22.
- **Thứ tự ưu tiên khi hai tài liệu mâu thuẫn:** theo PM-002 §2, **hiệu chỉnh/bác bỏ của PM-002 thắng DES-002**. Báo cáo này đánh giá theo PM-002, và ghi chú khi bản build bám DES-002 thay vì PM-002.
- **Không kiểm được trong phiên này:**
  1. Mọi ngưỡng phụ thuộc render (tràn ngang, kích thước vùng chạm thực tế, `scrollHeight − clientHeight`, console, focus nhìn thấy bằng mắt, reduced-motion ở runtime).
  2. `git diff` (AC-P22) — phiên này không chạy git/shell.
  3. Hồi quy T1–T20 (AC-P20) — **repo không có tập tin harness**: tìm `*.mjs` và `**/*test*` trả về 0 tập tin; `grep "test\.mjs"` toàn repo chỉ thấy 2 lần **được nhắc trong tài liệu** (`docs/reviews/antigravity-build-review.md:206`, `docs/reviews/customization-product-plan.md:509`), không có tập tin thật.

---

## 1. Phạm vi

**Trong phạm vi**

- FE-101…FE-106 (markup hộp thoại, model giỏ v2, controller, giỏ-theo-cấu-hình, CSS hộp thoại, copy/toast).
- AC-P01…AC-P22 và T12–T20 của PM-002.
- Các mục kiểm chuyên biệt được yêu cầu: migration `dudu-cart` → `dudu-cart-v2`, canonical key, giá tính lại từ catalog, cấu hình trùng/khác, overlay/focus/`inert`, microcopy "minh hoạ".

**Ngoài phạm vi (không tự mở rộng)**

- Thanh toán, kênh nhận đơn thật, POS, tài khoản, tồn kho (`REQUIREMENTS.md` §Out of scope).
- Đo thị giác 5 viewport và kết luận browser — thuộc `QA-202` (Antigravity), ghi vào `docs/reviews/antigravity-customization-review.md`.
- Xác nhận giá/topping thật — thuộc `BIZ-003` (human owner).

---

## 2. Ma trận AC-P01…AC-P22

| Mã | Tiêu chí (rút gọn) | Static | Bằng chứng / ghi chú |
|---|---|---|---|
| **AC-P01** | Mọi nút `+` mở hộp thoại tùy chỉnh, `#custom-title` đúng món | **Static PASS** | `renderMenu()` gắn `data-customize="<productId>"` + `aria-label="Tùy chỉnh …"` (`app.js:356–360`); 6 món trong `PRODUCTS` (`app.js:14–93`); `openCustomization()` đặt `customTitle.textContent = product.name` (`app.js:562`). Browser pending: 6/6 click chưa chạy. |
| **AC-P02** | 4 nhóm chọn được, có `fieldset`+`legend` | **Static PASS** | 4 `<fieldset class="option-group">` với `<legend>`: `index.html:229–273`; đủ 2 size / 5 đường / 4 đá / 5 topping. Browser pending: kiểm tra chọn từng mức. |
| **AC-P03** | Hai cấu hình khác nhau = hai dòng | **Static PASS** | `makeConfigKey()` nhúng `size/sugar/ice/toppingsKey` (`app.js:190–193`); `addConfiguredToCart()` chỉ gộp khi trùng `key` (`app.js:612–614`). Browser pending. |
| **AC-P04** | Cùng cấu hình = một dòng, cộng dồn | **Static PASS** | Gộp theo `key` + kẹp `MAX_QTY` (`app.js:612–613`); đường migrate cũng gộp cùng hàm qua `mergeRecords()` (`app.js:227–236`). |
| **AC-P05** | Đơn giá = gốc + size + Σ topping; thành tiền = đơn giá × SL | **Static PASS** | `unitPriceOf()` là nguồn duy nhất (`app.js:208–217`); dùng lại ở cart (`app.js:291`), tổng (`app.js:304`), CTA (`app.js:560–566`), copy (`app.js:736`). Số nguyên VND, sai số 0 đồng. Browser pending. |
| **AC-P06** | Mọi phụ thu kèm nhãn "minh hoạ" | **Static PASS** | Size L: `500ml minh hoạ · +6.000 ₫ minh hoạ` (`index.html:238`); mỗi hàng topping có `<small>minh hoạ</small>` (`index.html:267–271`); `#custom-desc` (`index.html:214`) và disclaimer chân (`index.html:286`). |
| **AC-P07** | Giỏ persist qua reload gồm cấu hình | **Static PASS** | `saveCart()` ghi v2 (`app.js:281–287`), gọi trong mỗi `renderCart()` (`app.js:445`); `loadCart()` đọc v2 (`app.js:247–255`). Browser pending: reload thật. |
| **AC-P08** | Dữ liệu phẳng cũ được migrate | **Static PASS** | Nhánh legacy `app.js:257–276`. |
| **AC-P09** | Văn bản copy có Size/%đường/%đá/topping/đơn giá/tổng | **Static PASS** | Sinh chuỗi `app.js:734–749`; `describeConfig()` (`app.js:219–225`). |
| **AC-P10** | Không câu nào ngụ ý đơn đã gửi | **Static PASS** | Quét `dist/` bằng mẫu `đã gửi|thành công|xác nhận đơn|hotline|0\d{9,}|09\d{2}[ .]?\d{3}[ .]?\d{3}`: **0 match**. Xem ghi chú Low L-09 về cụm "xác nhận giá … nhận đơn". |
| **AC-P11** | Escape huỷ nháp + trả focus về nút mở | **Static PASS** | `keydown` → `closeCustomization(true)` (`app.js:783–785`); trả focus khi `isConnected` (`app.js:603`). Browser pending. |
| **AC-P12** | Không bao giờ hai overlay cùng mở | **Static PASS** | Mở custom đóng cart trước (`app.js:579`); `openCart()` đóng custom trước (`app.js:479`). Bất biến `drawer-open`/`custom-open` không thể cùng tồn tại qua hai cửa công khai. Browser pending. |
| **AC-P13** | Không tràn ngang ở 5 viewport | **Browser pending** | Không đủ bằng chứng tĩnh. Ghi nhận tín hiệu tĩnh tốt: không có `overflow-x: auto`/`scroll-snap` trong khối custom (`grep` 0 match); `.option-pills` dùng `auto-fit` và bị ép 2 cột dưới 360px (`styles.css:1460, 1577–1578`); `.topping-item` dùng `minmax(0,1fr)` (`styles.css:1514`). **Không được** lấy "không thấy thanh cuộn" làm bằng chứng (bài học QA2-05, `body{overflow-x:hidden}`). |
| **AC-P14** | Vùng chạm ≥44×44, khoảng cách ≥8px | **Static PASS (CSS) / Browser pending** | `.icon-button` 44×44 (`styles.css:1090–1091`), `.stepper-button` 44×44 (`1545`), `.chip-content`/`.pill-chip > span` `min-height:48px` (`1474`), `.topping-item` `min-height:52px` (`1511`), `.button` `min-height:48px` (`228`); gap 8px ở chip/topping/stepper (`1458`,`1508`,`1544`). **Cảnh báo đo lường:** `.custom-input` cố ý là 1×1 clipped (`styles.css:1462–1472`); nếu harness đo `input` theo kiểu "mọi control ≥44px" thì **sẽ FAIL sai**. Phải đo `.chip-content`, `.pill-chip > span`, `.topping-item`, `.stepper-button`, `.icon-button`, `#add-configured-item`. |
| **AC-P15** | Tương phản chữ ≥4,5:1 | **Static PASS (tính từ token) / Browser pending** | `--plum` #5a1236 trên #fff ≈ 12,3:1; chữ đã chọn #fff trên `--plum`; `--plum-deep` trên #fff; `--muted` #6d4f5e trên paper = **6,89:1** (khớp mốc đã ghi); nhãn "Mặc định demo" dùng `--lime` trên `--plum` ≈ **10,5:1** (`styles.css:1501`). |
| **AC-P16** | Tương phản viền control ≥3:1 | **Static PASS (tính từ token) / Browser pending** | `--line-strong` #8a6a7c: trên paper 4,55:1, trên #fff 4,74:1, trên cream 4,37:1. Nút Giảm disabled giữ nguyên viền `--line-strong` trên nền cream (`styles.css:1548`) ⇒ 4,37:1 ≥ 3:1 — thoả DES-C15, **không** hạ opacity. |
| **AC-P17** | Focus ring ≥3:1 trên paper **và** cream; không bị bo méo | **Static PASS (tính từ token) / Browser pending** | `--focus-ring` #35071f: trên paper = **16,80:1** (khớp mốc docs), trên cream ≈ **16,13:1**. Quy tắc focus của hộp thoại đặt ở `styles.css:1502`, sau dòng 194 theo đúng yêu cầu. Nút tròn khai `border-radius:50%` **sau** dòng 189 (`1089`, `1139`, `1545`, `866`) nên không bị ghi đè thành 10px. Xem Medium M-03 cho trường hợp hàng topping. |
| **AC-P18** | Dấu tiếng Việt không tràn hộp dòng (delta ≤1px) | **Browser pending** | Tín hiệu tĩnh: `line-height` ≥1,25 cho `.chip-content` (`styles.css:1486`), `.topping-name` 1,3 (`1526`), `.option-legend` 1,3 (`1453`). Không có số đo. |
| **AC-P19** | Reduced motion: 0,01ms, `transform:none`, chức năng không đổi | **Static PASS / Browser pending** | Khối chung `styles.css:136–146` + khối custom `1583–1592`: `transition-duration:.01ms !important`; `transform:none` cho dialog/backdrop/chip/topping/stepper; có nhánh `@media (min-width:720px)` khôi phục `translate(-50%,-50%)` để dialog **không** lệch tâm khi tắt transform (`styles.css:1589–1591`). |
| **AC-P20** | Hồi quy T1–T11 + T12–T20, tổng `NN/NN PASS`, 0 fail | **Harness pending** | **Không có tập tin harness trong repo** (xem §0). Không thể tuyên bố bất kỳ tổng nào. Không kế thừa con số 55/55 của bản build cũ. |
| **AC-P21** | Console 0 lỗi JS sau mọi luồng | **Browser pending** | Tín hiệu tĩnh: mọi thao tác DOM đều có guard (`customDialog`, `customState`, `record` đã chuẩn hoá); không thấy đường đi chắc chắn ném lỗi. Không thay thế được console thật. |
| **AC-P22** | `git diff` chỉ chạm 3 tập tin `dist/` + harness + `docs/reviews/` | **Không kiểm chứng (phiên không chạy git)** | Chỉ có thể xác nhận: phiên này **không** sửa `dist/` và **không** sửa `TASKS.md`; tập tin duy nhất được tạo là `docs/reviews/customization-qa.md`. |

**Tổng AC-P:** Static PASS 17/22 (P01–P12, P14–P17, P19), Browser/Harness pending 5/22 (P13, P18, P20, P21, P22), Static FAIL **0/22**.

---

## 3. Ma trận T12–T20 (tĩnh)

| ID | Kết quả tĩnh | Bằng chứng / ghi chú |
|---|---|---|
| T12.1 | Static PASS / Browser pending | `openCustomization()` set default M/50/70/[]/1 (`app.js:581–588`); radio M/50/70 đã `checked` sẵn trong HTML (`index.html:233, 248, 258`); `syncCustomizationForm()` đồng bộ lại (`app.js:525–533`). |
| T12.2 | Static PASS / Browser pending | `closeCart(false)` (`app.js:579`) gỡ `drawer-open` (`app.js:498`); sau đó `inert` phủ `.site-header, main, footer, .cart-drawer` (`app.js:590`). |
| T12.3 | Static PASS (cơ chế) / **không có control trong UI** | `openCart()` gỡ `custom-open` **trước** khi thêm `drawer-open` (`app.js:479`, `488`); `closeCustomization()` gỡ `inert` khỏi `.cart-drawer` (`app.js:602`); `openCart()` chỉ phủ `inert` lên `backgroundLandmarks()` — không gồm drawer (`app.js:485–487`). Tuy nhiên hộp thoại **không có nút "Mở giỏ hàng"** (FE-101 không yêu cầu), nên ca test như viết không bấm được. Xem Low L-08. |
| T13.1 | Static PASS | `unitPriceOf()` = `product.price + SIZES[size].surcharge` (`app.js:211–216`); L = 6000 (`app.js:101`). |
| T13.2 | Static PASS | Bảng `TOPPINGS` 5000/5000/6000/10000/8000 (`app.js:105–111`). |
| T13.3 | Static PASS | 10000+8000+6000 = 24000; CTA = `unit × qty` (`app.js:561–566`). |
| T13.4 | Static PASS | 45000+6000+5000 = 56000; CTA/qty2 = 112000 (`app.js:566`); tổng giỏ dùng cùng `unitPriceOf` (`app.js:301–307`). |
| T13.5 | Static PASS | `describeConfig()` chỉ thêm `thêm:` khi `names.length` (`app.js:222–223`). |
| T14.1 | Static PASS | Hai `key` khác nhau → hai phần tử `cart` (`app.js:612–614`); tổng = Σ `unitPrice×qty` (`app.js:301–307`). |
| T14.2 | Static PASS | Gộp + kẹp 20 (`app.js:613`); badge = `cartCount()` (`app.js:423–431`). |
| T14.3 | Static PASS | `canonicalToppings()` khử trùng lặp + `.sort()` (`app.js:178–188`) ⇒ `pearls,mochi` và `mochi,pearls` cho cùng `toppingsKey`. |
| T14.4 | Static PASS | `quantity<=0` ⇒ `splice` giữ nguyên thứ tự các dòng còn lại (`app.js:628`). |
| T15.1 | Static PASS / Browser pending | vòng `loadCart()`→`normalizeRecord()`→render (`app.js:239–255, 279`). |
| T15.2 | Static PASS | migrate → `{version:2,items}` (`app.js:271`) → `removeItem` legacy (`app.js:272`); badge/tổng suy ra từ catalog: 2×45000 + 42000 = 132000. |
| T15.3 | Static PASS | `JSON.parse('{{{')` ném → `catch` trả `[]` (`app.js:274–276`); `renderMenu("all")` vẫn chạy độc lập (`app.js:813`). |
| T15.4 | Static PASS | `[]` / `"abc"` / `null` đều rơi vào guard `app.js:260`. |
| T15.5 | Static PASS | khử trùng lặp + cắt 3 (`app.js:178–188`); `SIZES["XL"]` falsy ⇒ về M (`app.js:197`); `SUGARS.indexOf(33)<0` ⇒ về 50 (`app.js:198`). |
| T15.6 | Static PASS | `Math.min(MAX_QTY, …)` (`app.js:202`). |
| T15.7 | Static PASS | `!findProduct(...)` ⇒ `null` ⇒ rơi khỏi giỏ (`app.js:196`). |
| T16.1 | Static PASS / Browser pending | `first.focus()` sau ép reflow (`app.js:593–595`). |
| T16.2 | Static PASS / Browser pending | Không có key-trap thủ công; cô lập bằng `inert` trên `.skip-link, .site-header, main, footer, .cart-drawer` (`app.js:468–475, 590`). Các phần tử còn lại ngoài dialog đều không tabbable. |
| T16.3 | Static PASS (hành vi radio gốc) / Browser pending | Không hiện thực roving tabindex; PM-002 R-07 cho phép phương án "radio gốc theo mặc định trình duyệt". |
| T16.4 | Static PASS | Chỉ nghe `change`, không nghe `click` trên label (`app.js:696–708`) ⇒ không double-toggle (E-06). |
| T16.5 | Static PASS / Browser pending | Escape → `closeCustomization(true)` (`app.js:784–785`) → focus `customLastFocused` (`app.js:603`). |
| T16.6 | Static PASS / Browser pending | Đóng: `aria-hidden="true"` + `visibility:hidden` + `pointer-events:none` (`app.js:601`, `styles.css:1358–1360, 1381–1383`). |
| T16.7 | Static PASS | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="custom-title"`; `h2#custom-title` tồn tại (`index.html:199–213`). |
| T17.1 | Static PASS / Browser pending | `syncToppingLimit()` đặt `disabled` + `aria-disabled` cho ô chưa chọn khi đạt 3 (`app.js:535–543`). |
| T17.2 | Static PASS | `syncToppingLimit()` chạy lại mỗi `change`, tính `atLimit` hai chiều (`app.js:537–541`). |
| T17.3 | Static PASS | `disabled` chặn cả `change`; `changeQuantity`/giá không đổi. |
| T17.4 | Static PASS (tính từ token) / Browser pending | `decrease.disabled` khi qty≤1 (`app.js:567–571`); viền disabled giữ `--line-strong` trên cream = 4,37:1 (`styles.css:1548`). |
| T18.1 | Static PASS | Chuỗi có Size/đường/đá/topping + `Tổng tạm tính` + câu ghi chú (`app.js:734–749`). |
| T18.2 | Static PASS | Không topping ⇒ không có `thêm:` (`app.js:222–223`). |
| T18.3 | Static PASS (quét chuỗi sinh ra) | Văn bản copy không chứa `đã gửi`/`đặt hàng thành công`/`xác nhận đơn`/số điện thoại. Xem Low L-09 (cụm "xác nhận giá và kênh nhận đơn"). |
| T19.1 | Static PASS | Size L + mọi topping có "minh hoạ" cùng nhóm; `#custom-desc` + disclaimer chân hộp thoại luôn hiển thị vì footer `flex:none` (`styles.css:1536`). |
| T19.2 | Static PASS | Quét `dist/` mẫu hotline/số điện thoại: **0 match**; `visit` vẫn ghi "Địa chỉ sẽ cập nhật khi khai trương" (`index.html:166, 173`). |
| T19.3 | Static PASS | Không có chuỗi ngụ ý đã gửi đơn trong DOM tĩnh lẫn chuỗi sinh ra. |
| T20.1 | Static PASS / Browser pending | `styles.css:1583–1592`; chức năng (mở/đóng/chọn) không phụ thuộc transition. |
| T20.2 | **Browser pending** | Không đo được. Không dùng "không thấy thanh cuộn" làm bằng chứng. |
| T20.3 | Static PASS (CSS min) / Browser pending | Xem AC-P14 + cảnh báo `.custom-input` 1×1. |
| T20.4 | **Browser pending** | Chỉ có tín hiệu `line-height` (§AC-P18). |
| T20.5 | **Browser pending** | Cần console thật. |

**Tổng T12–T20:** 30 ca static PASS, 4 ca Browser pending (T20.2, T20.4, T20.5, và T12.3 không có control để bấm), 0 static FAIL. **Không** có tổng `NN/NN PASS` vì không có harness chạy được — đây là khoảng trống bằng chứng, không phải kết quả.

---

## 4. Findings

### 4.1 High

**Trong `dist/`: 0 finding High.** Không tìm thấy lỗi tĩnh nào phá vỡ trực tiếp một AC-P hoặc T12–T20 đã liệt kê.

**Chặn gate kiểm chứng (không phải lỗi mã trong `dist/`):**

- **H-V1 — Không có harness hồi quy.** `glob **/*test*` và `glob *.mjs` trả về 0 tập tin; `test.mjs` chỉ được nhắc trong tài liệu (`docs/reviews/antigravity-build-review.md:206`, `docs/reviews/customization-product-plan.md:509`). Hệ quả: AC-P20 và **toàn bộ** bằng chứng T12–T20 (kể cả T13–T15 vốn rất dễ chạy) không thể đóng; con số 55/55 thuộc bản build **cũ** và không được kế thừa (`customization-product-plan.md:13`).
- **H-V2 — Toàn bộ ma trận browser chưa chạy (QA-202).** 5/22 AC-P (P13, P18, P20, P21, P22) và các ca T20.x phụ thuộc render/console/git.

### 4.2 Medium (phải sửa trước khi đóng gate — PM-002 §12.3 yêu cầu 0 Medium)

**M-01 — Nút `+` số lượng không bao giờ `disabled`/`aria-disabled` khi đạt `MAX_QTY` = 20.**
- Tiêu chí: PM-002 §4.1 B4 ("ở `MAX_QTY` thì nút `+` `disabled`"), §5.2 U3, §7 E-13.
- Bằng chứng: `updateCustomizationUI()` chỉ quản lý nút giảm — `app.js:567–571` (`decrease.disabled = record.quantity <= 1`); nút tăng `[data-custom-increase]` chỉ bị kẹp giá trị — `app.js:657–661` (`Math.min(MAX_QTY, …)`). HTML nút tăng không có `disabled` (`index.html:281`).
- Tác động: hành vi đúng (không vượt 20) nhưng trạng thái điều khiển sai — người dùng bàn phím/screen reader không nhận được tín hiệu "đã đạt tối đa"; nút vẫn trông bấm được. Không có AC-P/T nào phủ trực tiếp, nhưng đây là yêu cầu chốt trong PM-002.
- Hướng sửa đề xuất (không tự sửa): trong `updateCustomizationUI()` đặt `increase.disabled = record.quantity >= MAX_QTY` + `aria-disabled`, đối xứng với nút giảm; thêm style `.stepper-button:disabled` đã có sẵn.

**M-02 — `normalizeRecord()` chấp nhận khóa thừa hưởng từ `Object.prototype` làm `size` hợp lệ ⇒ giá `NaN`.**
- Tiêu chí: PM-002 §5.1 V3 ("`SIZES` có `raw.size`"), §3.3/E-05 ("không tin `localStorage`").
- Bằng chứng: `app.js:197` dùng `SIZES[record.size] ? record.size : DEFAULT` — với `SIZES` là object literal (`app.js:99–102`), các khóa `constructor`/`toString`/`valueOf`/`__proto__`/`hasOwnProperty`… đều **truthy**. Dữ liệu v2 do người dùng sửa thành `{"size":"toString"}` sẽ lọt qua chuẩn hoá; sau đó `unitPriceOf()` tại `app.js:211` (`SIZES[record.size] || SIZES.M`) vẫn truthy ⇒ `size.surcharge === undefined` ⇒ `price + undefined` = `NaN`; `cartRow()` tại `app.js:388` (`SIZES[record.size].label`) in ra `undefined`; `money(NaN)` cho "NaN ₫".
- Tác động: dòng giỏ hỏng hiển thị (NaN ₫ / "undefined"), tổng giỏ `NaN`. Không có XSS (giá trị lọt qua chỉ thuộc tập hữu hạn tên thuộc tính thừa hưởng, không phải chuỗi tự do), nhưng phá tính toàn vẹn dữ liệu và làm sai lệch mọi con số.
- Hướng sửa đề xuất: dùng `Object.prototype.hasOwnProperty.call(SIZES, record.size)` ở V3, và fallback tường minh trong `unitPriceOf`/`cartRow` (`SIZES.M` mặc định).

**M-03 — Focus indicator của hàng topping vẽ trên `.topping-box` 24×24, không bao quanh cả hàng.**
- Tiêu chí: PM-002 §2.2 **DES-C05** ("thêm `box-shadow`/`outline` cho **toàn hàng** `.topping-item` qua `input:focus-visible ~ …`").
- Bằng chứng: `styles.css:1502` (`… .custom-input:focus-visible ~ .topping-box { outline: 3px solid var(--focus-ring); … }`) và `styles.css:1533` (chỉ chỉnh `border-radius: 7px` trên chính `.topping-box`). Không có quy tắc nào tác động lên `.topping-item` khi input bên trong được focus.
- Tác động: vùng focus hiển thị chỉ quanh ô vuông 24px, không bao quanh control 52px mà người dùng thực sự tương tác. Tương phản viền vẫn đạt (16,13–16,80:1), nên **không** phá SC 1.4.11/2.4.11 AA, nhưng lệch yêu cầu đã chốt và yếu hơn về "focus appearance". Codebase đã dùng `:has()` ở `styles.css:1530–1532` nên có sẵn cách viết đúng: `.topping-item:has(.custom-input:focus-visible)`.
- Trạng thái: cần QA-202 xác nhận bằng mắt; đề xuất sửa trước gate vì DES-C05 là mục "Accepted with correction" bắt buộc.

**M-04 — Không có giới hạn số dòng giỏ (20) và CTA không bao giờ bị vô hiệu hoá.**
- Tiêu chí: PM-002 §5.2 U4, §7 E-17 ("giỏ có 20 dòng ⇒ CTA `disabled` + thông báo trong `#custom-status`").
- Bằng chứng: `addConfiguredToCart()` (`app.js:608–621`) không kiểm tra `cart.length`; `index.html:285` không có nhánh `disabled`; không có `MAX_ITEMS` trong hằng số (`app.js:95–112`).
- Tác động: giỏ có thể phình không giới hạn số dòng; yêu cầu phòng thủ của kế hoạch không được hiện thực. **Không** có AC-P/T nào phủ mục này, nên nó không làm đổi kết quả ma trận AC, nhưng là chênh lệch so với PM-002.

### 4.3 Low (ghi nhận, không chặn gate)

| ID | Nội dung | Bằng chứng |
|---|---|---|
| L-01 | `.custom-backdrop` thiếu `aria-hidden="true"` như mẫu §6.1 (div rỗng, không focusable nên rủi ro AT thấp). | `index.html:198` (mẫu ở `customization-product-plan.md:339`). |
| L-02 | Thiếu các hàm thuần đúng tên ở §3.4 (`lineTotalOf`, `cartTotalOf`, `cartCountOf`, `mergeIntoCart`); phép `unit × qty` lặp ở 4 nơi và logic gộp lặp 2 nơi. | `app.js:301–307, 380, 561, 736`; gộp: `app.js:227–236` vs `app.js:612–614`. |
| L-03 | V10 không trả `null` cho `quantity` không hữu hạn/≤0 mà ép về 1; quantity legacy không hợp lệ cũng thành 1 thay vì bị bỏ. | `app.js:201–202`, `app.js:261–269`. |
| L-04 | V9 cắt 3 topping theo **thứ tự nguồn** trước khi sort (kế hoạch ghi "theo thứ tự catalog"); `describeConfig()`/cart/copy nối topping theo **alphabet** (canonical) chứ không theo thứ tự catalog §9. Vẫn tất định cho cùng cấu hình. | `app.js:178–188, 222–223, 381, 736`. |
| L-05 | Không có assert dev cấm `-`/`__` trong topping id (E-04). Rủi ro thấp vì catalog hard-code toàn id sạch (`pearls, aloe, waterchestnut, cheesefoam, mochi`). | `app.js:105–111, 190–193`. |
| L-06 | Khi `customLastFocused` đã bị gỡ khỏi DOM, không có fallback về `[data-open-cart]` như §6.2; thêm nữa `openCart()` lấy `lastFocused` **sau** khi đóng dialog nên mục tiêu trả focus có thể là control đã ẩn. | `app.js:603`, `app.js:479–480`. |
| L-07 | E-10 (Escape khi cả hai overlay cùng mở ⇒ đóng cả hai) chưa hiện thực: chỉ nhánh `custom-open` chạy. Trạng thái này không tới được qua hai cửa công khai. | `app.js:783–789`. |
| L-08 | Hộp thoại không có control "Mở giỏ hàng" như B7/E-08 mô tả, nên T12.3 không thao tác được như văn bản; bất biến vẫn được bảo vệ ở `openCart()`. | `index.html:276–288` vs `app.js:479`. |
| L-09 | Câu ghi chú copy rút gọn so với §9 ("…vui lòng xác nhận giá và kênh nhận đơn với DuDu"). Không chứa mẫu cấm `xác nhận đơn`, nhưng một bộ quét thô bắt cặp "xác nhận"+"đơn" có thể báo nhầm; nên chốt lại câu chữ. | `app.js:747`. |
| L-10 | Không debounce vùng `role="status"` (DES-C09 muốn phát "sau khi người dùng dừng thao tác"): mỗi click `+`/`−` và mỗi `change` phát một câu. Chỉ còn **một** live region — đúng phần cốt lõi của DES-C09. | `app.js:572–574, 651–661`. |
| L-11 | `flashAddButton()` không kiểm tra đối số là HTMLElement. | `app.js:511–517, 616–618`. |
| L-12 | Ô tick topping dùng ký tự `✓` thay vì SVG; phụ thuộc font nhưng nằm trong `aria-hidden="true"`, màu `--lime` trên `--plum` ≈10,5:1. Hai class `option-pills--sugar` / `option-pills--ice` không có quy tắc CSS (no-op). | `index.html:267–271`; `index.html:245, 256`. |

### 4.4 Điểm đã làm đúng so với các hiệu chỉnh bắt buộc của PM-002 §2.2

| Mã | Kết quả | Bằng chứng |
|---|---|---|
| DES-C01 | **PASS** — input ẩn bằng `clip-path: inset(50%)`, 1×1, không `display:none`/`opacity:0`; focus vẽ trên phần tử hiển thị. | `styles.css:1462–1472, 1502` |
| DES-C02 | **PASS** — không `<dialog>`, không `showModal()`; dùng `<div role="dialog" aria-modal="true">` đúng khuôn mẫu `.cart-drawer`. | `index.html:199–208`; `grep showModal\|<dialog` = 0 match |
| DES-C03 | **PASS** — không `<form>`, không `method="dialog"`; CTA `type="button"`. | `index.html:285` |
| DES-C04 | **PASS** — giá topping trên nền `#fff` dùng `--plum-deep`, không dùng `--pink-ink`. | `styles.css:1519, 1527` |
| DES-C05 | **Một phần** — xem M-03 (có ring nhưng trên `.topping-box`, không trên cả hàng). | `styles.css:1502, 1533` |
| DES-C06 | **PASS** — bất biến một-overlay hai chiều; cô lập bằng `inert`, không key-trap tay. | `app.js:479, 579, 590` |
| DES-C07 | **PASS** — chỉ một class trạng thái `custom-open` trên `<body>`. | `styles.css:1349, 1362, 1390`; `grep dialog-open` = 0 match |
| DES-C08 | **PASS** — không emoji trong control; `✦` chỉ ở ticker trang trí (`aria-hidden`), nhãn khuyến nghị đổi thành "Mặc định demo". | `grep ✨` trên `dist/` = 0 match; `index.html:248, 258` |
| DES-C09 | **Một phần** — chỉ một `role="status"`; `#custom-quantity` không có `aria-live`; thiếu debounce (L-10). | `index.html:280, 287`; `app.js:572–574` |
| DES-C10 | **PASS** — topping id `[a-z0-9]`, nối `-`, sort, rỗng = `none`, cấm `-`/`__` (thiếu assert dev — L-05). | `app.js:178–193, 105–111` |
| DES-C11 | **PASS** — ghi `dudu-cart-v2`, đọc legacy phẳng, migrate rồi `removeItem("dudu-cart")`. | `app.js:95–96, 271–272` |
| DES-C12 | **PASS** — không lưu `unitPrice`/`name`; luôn tính lại; startup ghi lại v2 đã chuẩn hoá qua `renderCart()`. | `app.js:203, 281–283, 445, 813–814`; `grep unitPrice` chỉ thấy biến cục bộ |
| DES-C13 | **PASS** — `aria-describedby="custom-desc"` trỏ dòng hướng dẫn ổn định, không trỏ mô tả marketing. | `index.html:205, 214` |
| DES-C14 | **PASS** — có `collectCustomization` tương đương (`customDraftRecord`), `closeCustomization`, `addConfiguredToCart`, `syncToppingLimit`, `updateCustomizationUI`, `changeQuantity`. | `app.js:535–632` |
| DES-C15 | **PASS** — nút Giảm `disabled` nhưng **không** hạ opacity; nền cream + chữ `--muted`, viền giữ `--line-strong` (4,37:1). | `styles.css:1548` |
| DES-R01 | **PASS** — z-index 96 backdrop / 98 dialog / 110 toast; không mở đồng thời. | `styles.css:1353, 1371, 1219` |
| DES-R02 | **PASS** — một cột ở mọi viewport; không có layout hai cột. | `styles.css:1369–1428` |
| DES-R03 | **PASS** — không `overflow-x:auto`, không `scroll-snap`; chip xuống dòng/lưới. | `grep overflow-x\|scroll-snap` trên `dist/` = 0 match |
| DES-R04 | **PASS** — trạng thái nút Giảm suy ra từ `record.quantity`, giá trị khởi tạo trong HTML bị ghi đè khi mở. | `app.js:567–571` |
| DES-R05 | **PASS** — phiên này không sửa `TASKS.md`. | — |

---

## 5. Kiểm tra chuyên biệt theo yêu cầu

### 5.1 Migration `dudu-cart` → `dudu-cart-v2`

**Kết luận: Static PASS** với hai ghi chú Low.

Đường đi (`loadCart()`, `app.js:239–277`):
1. Đọc `dudu-cart-v2`; parse được và `payload.items` là mảng ⇒ `mergeRecords()` chuẩn hoá từng dòng (`app.js:247–255`).
2. Không có v2 ⇒ đọc `dudu-cart` phẳng; guard loại `null`/mảng/không-phải-object (`app.js:260`); mỗi cặp id → bản ghi `DEFAULTS` = Size M / 50% đường / 70% đá / không topping (`app.js:261–270`); id lạ bị bỏ qua ở `normalizeRecord` V2 (`app.js:196`).
3. Ghi `{version:2, items}` (`app.js:271`).
4. **Chỉ sau khi ghi thành công** mới `removeItem("dudu-cart")` (`app.js:272`) — hai lệnh nằm trong cùng một `try`; nếu `setItem` ném (private mode/quota) thì `removeItem` không chạy và legacy còn nguyên cho lần migrate sau. Đúng yêu cầu bắt buộc của §5.3.
5. Mọi lỗi ⇒ trả `[]`, không ném (`app.js:243–245, 252–254, 274–276`).

Kiểm chứng phụ:
- Ghi lại dữ liệu đã chuẩn hoá (tự chữa lành): `loadCart()` không ghi ngay, nhưng `renderCart()` chạy lúc khởi động (`app.js:814`) → `saveCart()` (`app.js:445`) ghi lại v2 đã chuẩn hoá. Đạt tinh thần DES-C12.
- Legacy hỏng (`{{{`) → giỏ rỗng, menu vẫn render vì `renderMenu("all")` độc lập (`app.js:813`). Đạt T15.3.
- Ghi chú: nếu v2 tồn tại nhưng hỏng/không có `items`, hàm trả `[]` và **không** thử legacy (`app.js:250–251`). Nhất quán với thứ tự §5.3 nhưng cần ghi nhận để QA-202 không test nhầm.
- Ghi chú: quantity legacy không hợp lệ (0, âm, `"abc"`) thành `1` thay vì bị bỏ (L-03).

### 5.2 Canonical key

**Kết luận: Static PASS.**

- Công thức: `[productId, size, sugar, ice, toppingPart].join("__")` (`app.js:190–193`).
- `toppingPart` = `canonicalToppings(...).join("-") || "none"` (`app.js:191`).
- `canonicalToppings()` (`app.js:178–188`): lọc id không có trong catalog, khử trùng lặp (giữ lần đầu), cắt `MAX_TOPPINGS`, `.sort()` ⇒ **thứ tự bấm không tạo hai dòng** (E-03/T14.3).
- Topping id toàn bộ `[a-z0-9]`, không `-`, không `__` (`app.js:105–111`) ⇒ `toppingsKey` không nhập nhằng; `productId` 6 món đều không chứa `__`.
- `key` **không** được parse ngược: khi render, `record.size/sugar/ice/toppings` có cấu trúc được dùng trực tiếp (`app.js:376–392`); `key` chỉ dùng để định danh/gộp/định vị nút (`app.js:612, 624, 396–411, 451`).
- Trùng khớp giữa migration và luồng mới: cả hai đi qua `normalizeRecord()` → `makeConfigKey()` (`app.js:204, 546–553`) ⇒ E-19 đạt.

### 5.3 Giá tính lại từ catalog (không tin `localStorage`)

**Kết luận: Static PASS.**

- Bản ghi lưu **không có** `unitPrice`, không có `name`: `normalizeRecord()` chỉ xuất `{productId, size, sugar, ice, toppings, quantity, key}` (`app.js:203–204`); `saveCart()` ghi đúng mảng `cart` đó (`app.js:283`).
- Mọi con số tiền đều đi qua `unitPriceOf()` (`app.js:208–217`), thứ tra `PRODUCTS` + `SIZES` + `TOPPINGS` tại thời điểm render: cart row (`app.js:291, 380–392`), tổng giỏ (`app.js:301–307`), CTA + đơn giá (`app.js:560–566`), tổng trong bản copy (`app.js:736, 746`).
- Không tìm thấy nơi nào tự cộng `base + surcharge` ngoài `unitPriceOf()` (đã quét toàn bộ `app.js`). Không có `parseInt`/`parseFloat` trên trường giá từ storage.
- Hệ quả E-05: `{"unitPrice":1}` trong localStorage bị bỏ hoàn toàn vì `normalizeRecord` không đọc trường giá.
- Ngoại lệ duy nhất: M-02 (size thừa hưởng prototype ⇒ `NaN`), và L-02 (phép `unit × qty` lặp lại nhưng vẫn trên cùng `unitPriceOf`).

### 5.4 Cấu hình trùng / khác

**Kết luận: Static PASS.**

- **Khác cấu hình = dòng riêng:** `key` khác ⇒ nhánh `else cart.push(record)` (`app.js:614`); hai dòng có giá và stepper riêng vì `cartRow()` render độc lập từng entry (`app.js:376–416`). Đạt E-02/T14.1.
- **Trùng cấu hình = gộp:** `existing.quantity = Math.min(MAX_QTY, existing.quantity + record.quantity)` (`app.js:613`) — không tạo dòng thứ hai, kẹp ở 20, số dư bị bỏ, không báo lỗi. Đạt E-01/E-20/T14.2.
- **Trùng khi nạp từ storage:** `mergeRecords()` gộp hai bản ghi cùng `key` ngay trong `loadCart()` (`app.js:227–236`) ⇒ dữ liệu cũ bị nhân bản cũng tự gộp.
- **Thứ tự chèn được giữ:** `push` ở cuối, `splice` khi về 0 (T14.4).
- **Giới hạn 3 topping** áp ở cả UI (`syncToppingLimit`, `app.js:535–543`) và tầng dữ liệu (`canonicalToppings`, `app.js:186`).
- **Thiếu:** giới hạn số **dòng** (M-04).

### 5.5 Overlay / focus / `inert`

**Kết luận: Static PASS** cho bất biến một-overlay và cô lập nền; có 1 Medium và 2 Low.

- **Một overlay:** `openCustomization()` gọi `closeCart(false)` nếu drawer đang mở (`app.js:579`); `openCart()` gọi `closeCustomization(false)` nếu custom đang mở (`app.js:479`). Không có đường nào để hai class cùng tồn tại qua UI.
- **`inert` đúng phạm vi:** `backgroundLandmarks()` = `.skip-link, .site-header, main, footer` (`app.js:468–475`), cộng thêm `.cart-drawer` khi mở custom (`app.js:590`). Khi mở cart, **không** phủ `inert` lên `.cart-drawer` (`app.js:485–487`) — đúng lưu ý ở `app.js:463–467`.
- **Focus vào dialog:** nhớ `customLastFocused` (`app.js:580`), `inert` trước, thêm class, ép reflow, rồi `focus()` radio Size M (`app.js:590–595`).
- **Đóng:** gỡ class → `aria-hidden="true"` → gỡ `inert` → trả focus nếu `isConnected` (`app.js:598–605`).
- **Escape:** chỉ xử lý khi có overlay (`app.js:783–789`) — E-09 đạt; E-10 chưa đạt (L-07).
- **Backdrop:** đóng và huỷ nháp, không focusable (không có `tabindex`) — E-27 đạt; thiếu `aria-hidden` (L-01).
- **Reduced motion:** vẫn giữ đúng vị trí tĩnh của bottom-sheet/dialog (`styles.css:1583–1592`).
- **Focus indicator:** chip/pill/CTA/nút tròn đạt (M-03 nêu riêng hàng topping).
- **Focus sau `+`/`−` trong giỏ:** `renderCart` tìm lại control theo `data-increase|decrease="<key>"`, có fallback sang dòng kế rồi nút đóng (`app.js:449–458`) — giữ hành vi QA2-03.

### 5.6 Microcopy "minh hoạ" và an toàn nội dung

**Kết luận: Static PASS.**

- Size L có "minh hoạ" **cạnh con số**: `500ml minh hoạ · +6.000 ₫ minh hoạ` (`index.html:238`).
- Mỗi hàng topping có `<small>minh hoạ</small>` cạnh giá (`index.html:267–271`).
- `#custom-desc`: "Mọi phụ thu là giá minh hoạ." (`index.html:214`).
- Disclaimer chân hộp thoại: "Giá món và phụ thu đang là nội dung minh hoạ cho bản thử nghiệm." (`index.html:286`) — luôn hiển thị vì footer `flex: none` (`styles.css:1536`).
- `#cart-summary` giữ disclaimer cũ (`index.html:334–337`).
- Không bịa thông tin kinh doanh mới: quét `dist/` mẫu hotline/số điện thoại = 0 match; mục "Ghé DuDu" vẫn "Đang cập nhật"/"Địa chỉ sẽ cập nhật" (`index.html:166, 173, 180`).
- Không emoji trong control; nhãn khuyến nghị là chữ ("Mặc định demo") — DES-C08/C9 đạt.
- Câu copy kết luôn nói "đơn minh hoạ" (`app.js:747`); xem L-09 về cách diễn đạt "xác nhận giá và kênh nhận đơn".

---

## 6. Đối chiếu FE-101…FE-106

| Task | Trạng thái tĩnh | Ghi chú |
|---|---|---|
| **FE-101** markup semantic | **PASS** (L-01, L-12) | `<div role="dialog" aria-modal="true">`, backdrop, header `h2`+nút đóng 44px, 4 `fieldset`+`legend`, `#custom-status`, footer stepper+CTA+disclaimer (`index.html:197–289`). Không `<dialog>`, không `<form>`, không emoji. Topping/size/sugar/ice viết tĩnh đúng bảng §3.1. |
| **FE-102** model + v2 + migration | **PASS** (M-02, M-04, L-02…L-05) | Hằng số, `makeConfigKey`, `unitPriceOf`, `normalizeRecord`, `mergeRecords`, `loadCart` v2 + migrate, `saveCart` bọc `try/catch` (`app.js:95–307`). `unitPriceOf` là nguồn tiền duy nhất. |
| **FE-103** controller | **PASS** (M-01, L-06, L-07) | `openCustomization`/`closeCustomization`/`customDraftRecord`/`syncToppingLimit`/`updateCustomizationUI`; dùng `change` (không `click`) cho topping; `Escape`; ép reflow; `inert`; bất biến một-overlay. |
| **FE-104** giỏ theo cấu hình | **PASS** | `cartRow()` render pill Size + dòng ` · ` + dòng topping + `X ₫ / ly` (đã gồm phụ thu) (`app.js:376–416`, `styles.css:1553–1555`); stepper dùng `key`; `renderCart(focusTarget)` khớp theo `key`. |
| **FE-105** CSS hộp thoại | **PASS** (M-03) | Bottom-sheet <720px / centered ≥720px; một cột; focus đặt sau dòng 194; `[hidden]` có `!important` (`styles.css:90`); reduced-motion; target ≥44px theo CSS; không cuộn ngang. |
| **FE-106** copy + toast | **PASS** (L-09) | Dòng món dùng `describeConfig()`; `Tổng tạm tính`; câu ghi chú minh hoạ; toast chỉ sau khi đóng hộp thoại (`app.js:617–620`). |

---

## 7. Static PASS / Browser pending — danh sách chưa kiểm chứng

Ghi rõ để không ai đọc nhầm thành "đã đo":

| Hạng mục | Trạng thái | Cách kiểm chứng lại (đề xuất cho QA-202) |
|---|---|---|
| Tràn ngang 320/390/768/1024/1440 (AC-P13, T20.2) | **Browser pending** | So `documentElement.scrollWidth === clientWidth` **và** `getBoundingClientRect().right > clientWidth` cho mọi phần tử trong `.custom-dialog` khi mở, ở cả 5 viewport. Không dùng "không có thanh cuộn". |
| Kích thước vùng chạm thực tế (AC-P14, T20.3) | **Browser pending** | Đo `.chip-content`, `.pill-chip > span`, `.topping-item`, `.stepper-button`, `.icon-button`, `#add-configured-item`, `[data-close-custom]`. **Bỏ qua `.custom-input`** (1×1 cố ý). Đo khoảng cách tâm-tới-tâm ≥8px. |
| Tương phản render (AC-P15/P16/P17) | **Browser pending** | Đo trên nền paper **và** cream; xác nhận focus ring không bị bo vuông và không bị che. Số tĩnh đã tính: 16,80:1 (paper) / 16,13:1 (cream) cho ring; 4,37–4,74:1 cho `--line-strong`; 6,89:1 cho `--muted` trên paper. |
| `scrollHeight − clientHeight` nhãn chip (AC-P18, T20.4) | **Browser pending** | Đo mọi `.chip-content`, `.pill-chip > span`, `.topping-name`, `.option-legend` ở 5 viewport; ngưỡng delta ≤1px. |
| Reduced-motion runtime (AC-P19, T20.1) | **Browser pending** | Bật `prefers-reduced-motion: reduce`: xác nhận dialog hiện tức thì, đúng vị trí (không lệch tâm ở ≥720px), mở/đóng/chọn vẫn hoạt động. |
| Console 0 lỗi (AC-P21, T20.5) | **Browser pending** | Chạy trọn luồng: mở dialog → đổi size/đường/đá → 3 topping → +/− tới 20 → thêm → mở giỏ → +/− tới 0 → copy → Escape; thu console. |
| Hồi quy T1–T20 (AC-P20) | **Harness pending** | Cần bổ sung `test.mjs` (T12–T20 như §11 PM-002) và chạy lại T1–T11; ghi tổng `NN/NN PASS`. |
| `git diff` phạm vi (AC-P22) | **Không kiểm chứng** | Chạy `git status --short` / `git diff --stat` ở phiên có quyền shell: chỉ `dist/index.html`, `dist/styles.css`, `dist/app.js`, harness và `docs/reviews/**`. |
| Focus nhìn thấy trên hàng topping (M-03) | **Browser pending** | Tab tới từng hàng topping ở 390px và 1440px; chụp lại vùng outline. |

---

## 8. Kết luận gate

**Gate hiện tại: KHÔNG ĐẠT (chưa thể đóng).**

Lý do, theo đúng điều kiện dừng của PM-002 §12.3 ("0 High và 0 Medium"):

1. **4 finding Medium** trong `dist/`: M-01 (`+` không disabled ở 20), M-02 (size thừa hưởng prototype ⇒ giá `NaN`), M-03 (focus hàng topping không bao quanh control), M-04 (thiếu giới hạn 20 dòng/CTA disabled). Điều kiện "0 Medium" **không** thoả.
2. **Chưa có bằng chứng runtime nào**: toàn bộ AC-P13/P18/P20/P21/P22 và các ca T20.x còn **Browser/Harness pending**. Không có số đo render nào được tạo trong phiên này.
3. **Không có harness hồi quy trong repo** ⇒ AC-P20 và toàn bộ T12–T20 chưa thể tuyên bố PASS; **không** kế thừa 55/55 của bản build cũ.

**Điểm đáng ghi nhận (static):** 0 finding High trong `dist/`; 17/22 AC-P đạt static; 14/15 hiệu chỉnh DES-C của PM-002 §2.2 đạt hoàn toàn (DES-C05 đạt một phần); toàn bộ 5 mục DES-R đạt; migration v2 đúng thứ tự "ghi trước, xoá legacy sau"; giá không bao giờ đọc từ storage; bất biến một-overlay được bảo vệ ở cả hai chiều.

**Thứ tự đề xuất để đóng gate (không tự thực hiện trong phiên này):**
1. **Codex** sửa M-01…M-04 (và cân nhắc L-03, L-04, L-06 nếu rẻ) — chỉ trong `dist/`.
2. **DeepSeek (QA-201)** bổ sung `test.mjs` cho T12–T20 và chạy lại T1–T11; ghi tổng `NN/NN PASS` vào tài liệu QA.
3. **Antigravity (QA-202)** đo 5 viewport theo §7 và ghi `docs/reviews/antigravity-customization-review.md`.
4. Gate chỉ đóng khi: 0 High, 0 Medium, T1–T20 xanh, và mọi ngưỡng render ở §7 có số đo thật.

---

## 9. Handoff

- **Task ID:** `QA-201` (static QA đối chiếu PM-002 với bản build `dist/`).
- **Files changed:** `docs/reviews/customization-qa.md` (mới, duy nhất). **Không** sửa `dist/`, **không** sửa `TASKS.md`, **không** sửa `docs/design-spec.md` hay bàn giao của agent khác.
- **Checks run:**
  - Đọc toàn bộ `dist/index.html` (347 dòng), `dist/styles.css` (1592 dòng), `dist/app.js` (815 dòng), `TASKS.md`, `REQUIREMENTS.md`, `AGENTS.md`, `docs/architecture.md`, PM-002, DES-002, `docs/design-spec.md` (đối chiếu token).
  - Quét nội dung `dist/` bằng regex: mẫu cấm về đơn đã gửi/hotline/số điện thoại → 0 match; emoji `✨` → 0 match; `overflow-x`/`scroll-snap`/`showModal`/`<dialog>`/`dialog-open` → 0 match.
  - Tính lại tương phản WCAG từ token hex; khớp các mốc đã ghi trong docs (16,80 / 6,89 / 4,55).
  - **Không** chạy trình duyệt, **không** chạy git/shell, **không** chạy harness (không tồn tại).
- **Kết quả:** AC-P static PASS 17/22 · pending 5/22 · FAIL 0; T12–T20 static PASS 30 ca, pending 4 ca, FAIL 0; findings: **0 High, 4 Medium, 12 Low**; gate **chưa đóng**.
- **Remaining risks / decisions:**
  - M-02 là lỗi toàn vẹn dữ liệu thật (NaN) dù chỉ kích hoạt bằng dữ liệu storage bị sửa — nên sửa dù không có AC phủ.
  - M-01/M-04 là yêu cầu đã chốt trong PM-002 nhưng **không** có AC-P/T nào phủ; cần người quyết định bảng bổ sung ca test nếu muốn đóng bằng bằng chứng.
  - `BIZ-003` vẫn mở: mọi phụ thu (Size L +6.000 ₫, 5 topping) phải giữ nhãn "minh hoạ" cho tới khi chủ quán xác nhận.
  - AC-P22 chưa kiểm; nếu phase sau có nhiều agent cùng ghi `dist/`, cần chạy `git diff` trước khi đóng.
- **Recommended next owner:** **Codex** (sửa M-01…M-04 trong `dist/`, không đụng `docs/`), sau đó **DeepSeek** (bổ sung và chạy harness T12–T20), rồi **Antigravity** (`QA-202` đo 5 viewport).

---

# 10. Recheck vòng 2 (QA-201) — sau khi Codex sửa `dist/`

**Revision được đọc trong phiên này:** `dist/index.html` **348 dòng**, `dist/app.js` **881 dòng**, `dist/styles.css` **1617 dòng** (bản build của §1–§9 cũ có 347/815/1592 dòng — mọi số dòng trong §1–§9 là **lịch sử audit**, không được viết lại hồi tố).
**Ràng buộc phiên:** không chạy trình duyệt, không chạy git/shell phụ, không gọi subagent, **không sửa** `dist/`, `TASKS.md`, `docs/design-spec.md` hay tài liệu của Codex/Antigravity. Thay đổi duy nhất của phiên: **nối thêm §10 này** vào `docs/reviews/customization-qa.md`.
**Bản chất bằng chứng:** toàn bộ §10 là **bằng chứng tĩnh** (đọc mã + suy luận tất định). **Không có số đo runtime nào được tạo ra trong phiên này.** Mọi mục cần đo vẫn là **Browser pending**, và lượt đo mới cho revision này sẽ do Codex/Antigravity cung cấp riêng.

## 10.1 Xác nhận M-01…M-04 (điều kiện "0 Medium" của PM-002 §12.3)

| Mã | Kết luận | Bằng chứng mới trên revision hiện tại | Ghi chú còn lại |
|---|---|---|---|
| **M-01** | **FIXED** | `updateCustomizationUI()` đặt đối xứng cả hai nút: `decrease.disabled = record.quantity <= 1` + `aria-disabled` (`app.js:599–602`), `increase.disabled = record.quantity >= MAX_QTY` + `aria-disabled` (`app.js:603–606`). `updateCustomizationUI(false)` chạy ngay khi mở hộp thoại qua `syncCustomizationForm()` (`app.js:636` → `555–563`), nên trạng thái đúng được thiết lập trước tương tác đầu tiên. `index.html:281` vẫn không có `disabled` tĩnh, nhưng dialog ở `aria-hidden="true"`/`visibility:hidden` (`index.html:206`, `styles.css:1381`) cho tới khi JS đồng bộ ⇒ không có nhịp lộ trạng thái sai. Nút `disabled` giữ viền `--line-strong` trên cream = 4,37:1 (`styles.css:1553`), thoả B4/U3. E-13 đạt: ở 20, nút `+` disabled nên nhánh click không chạy và không phát thông báo ồn ào. | Không. |
| **M-02** | **FIXED** | Cả ba nơi tra `SIZES` đều dùng khóa riêng: `Object.prototype.hasOwnProperty.call(SIZES, record.size)` ở `normalizeRecord` (`app.js:196`), `unitPriceOf` (`app.js:212`) và `describeConfig` (`app.js:221`), kèm fallback `DEFAULT_CUSTOMIZATION.size`. `"constructor"`, `"toString"`, `"valueOf"`, `"hasOwnProperty"`, `"__proto__"` đều **không** phải thuộc tính riêng ⇒ về Size M (`raw` `{size:"constructor"}` không qua được V3). `unitPriceOf` không còn cộng `undefined` ⇒ hết `NaN ₫`. | Hardening còn thiếu (không phải lỗi): `cartRow()` vẫn đọc thẳng `SIZES[record.size].label` (`app.js:389`). An toàn vì `cart` chỉ được ghi qua `normalizeRecord` (cổng duy nhất: `app.js:668` cho dòng mới, `app.js:230–234` cho `mergeRecords`) — không có đường tới được với `size` sai. |
| **M-03** | **FIXED** | Có quy tắc đúng yêu cầu DES-C05: `.topping-item:has(.custom-input:focus-visible) { outline: 3px solid var(--focus-ring); outline-offset: 2px; box-shadow: 0 0 0 5px var(--focus-ring-halo); }` (`styles.css:1534–1538`) ⇒ ring bao quanh **cả hàng** 52px, không chỉ ô 24px. Quy tắc nằm sau dòng 194 (đúng yêu cầu "đặt sau dòng 194"), và dùng `:has()` nhất quán với `styles.css:1530–1532`. | Ring giờ khớp ở **hai** chỗ cùng lúc: `.custom-input:focus-visible ~ .topping-box` (`styles.css:1502–1506`) và hàng (`1534–1538`) ⇒ khi focus một hàng topping sẽ thấy 2 vòng lồng nhau (ô 24px + cả hàng). Không sai chuẩn, chỉ là mỹ thuật — ghi thành **Low mới L-15**, cần QA-202 xác nhận bằng mắt. |
| **M-04** | **FIXED** | Hằng số `MAX_CART_LINES = 20` (`app.js:98`). `updateCustomizationUI()` tính `isNewLine`/`atLineLimit` và đặt CTA `disabled` + `aria-disabled` (`app.js:607–612`), đồng thời ghi thông báo vào `#custom-status` (`app.js:613–621`), kể cả nhánh không announce khi mở hộp thoại. `addConfiguredToCart()` có chặn phòng thủ thứ hai (`app.js:663–666`). CSS `.button:disabled` tồn tại (`styles.css:1569–1576`) và giữ viền `--line-strong` trên cream = 4,37:1. | Không. U4/E-17 chỉ chặn **số dòng** (không giới hạn tổng ly) — đúng thiết kế. Trường hợp cấu hình đã có trong giỏ thì CTA **vẫn bật** (gộp vào dòng cũ, không tăng số dòng) — đúng ý U4. |

**Kết luận §10.1: 4/4 Medium cũ đã FIXED; không có High/Medium mới phát sinh từ các thay đổi này.**

## 10.2 Kiểm lại 8 mục được yêu cầu

**a) Size prototype (M-02) — ĐẠT.** Ba lớp phòng thủ: chuẩn hoá (`app.js:196`), giá (`212`), nhãn (`221`). Đường dữ liệu bị sửa tay `{"size":"toString"}` giờ về `Size M`, `unitPriceOf` trả giá gốc + 0 phụ thu, `describeConfig` in `Size M` — không còn `NaN ₫`/`"undefined"`. Ghi nhận thêm: `canonicalToppings()` dùng `Object.create(null)` cho túi `requested` (`app.js:180`) nên bản thân việc gom topping cũng không dính khóa thừa hưởng.

**b) MAX_QTY button state — ĐẠT trong hộp thoại; hàng giỏ còn lệch (Low).** Hộp thoại: `−` disabled ở 1, `+` disabled ở 20, cả hai giữ `aria-label` đọc được (U3/B4/E-13) — `app.js:599–606`; viền disabled 4,37:1 (`styles.css:1553`). Hàng trong ngăn kéo giỏ: nút `+` (`app.js:407–413`) **không** bao giờ được đặt `disabled`, và `changeQuantity()` kẹp ở 20 (`app.js:686`) nhưng vẫn phát toast "Đã thêm một ly vào giỏ" (`app.js:688`) ⇒ tại 20 ly, người dùng bấm `+` thấy thông báo như thể đã thêm. Không có AC-P/T nào phủ stepper của **hàng giỏ** (B4/U3 nằm trong máy trạng thái hộp thoại), số lượng vẫn đúng nên đây là **Low L-14**, không phải Medium.

**c) Focus toàn hàng topping (M-03 / DES-C05) — ĐẠT.** `styles.css:1534–1538`; ring 16,13:1 (cream) – 16,80:1 (paper) theo token; `:has()` đã có tiền lệ trong file. Việc còn lại là **thẩm mỹ 2 vòng lồng nhau** (L-15) và cần mắt người ở 390/1440 (Browser pending).

**d) MAX_CART_LINES — ĐẠT.** `app.js:98`, `607–612`, `613–621`, `663–666`; giỏ 20 dòng + hộp thoại mở ở cấu hình mới ⇒ CTA `disabled` + `#custom-status` có câu "Giỏ đã đạt tối đa 20 cấu hình…" mà **hộp thoại vẫn mở** (đúng E-17). Khi bớt một dòng rồi mở lại, điều kiện `cart.length >= 20` tự hết. Không có đường nào thêm dòng thứ 21 qua UI (nút disabled + chặn phòng thủ).

**e) Quantity invalid — ĐẠT (đóng L-03).** V10 mới tại `app.js:200–203`: `!Number.isFinite(q) || q <= 0` ⇒ `null`; `Math.min(MAX_QTY, Math.floor(q))`; `< 1` ⇒ `null`. Đối chiếu tất định: `0`→null, `-5`→null, `"abc"`→null, `null`→null, `0.5`→null, `NaN`→null, `2.9`→2, `"3"`→3, `999`→20. Hệ quả: dòng legacy có quantity không hợp lệ **bị bỏ** thay vì bị ép thành 1 — đúng PM-002 §5.1 V10 và §5.3 bước 2 ("quantity hợp lệ"), và không phá T15.4/T15.6.

**f) Catalog order — ĐẠT (đóng cả hai nửa L-04).** `canonicalToppings()` lọc theo chính mảng `TOPPINGS` rồi mới `.slice(0, MAX_TOPPINGS)` (`app.js:179–187`) ⇒ V9 "cắt còn 3 theo **thứ tự catalog**", không còn theo thứ tự nguồn/bấm. Vì `describeConfig` (`222–223`), `cartRow` (`382`) và bản copy (`793`) đều đi qua `canonicalToppings`, chuỗi topping luôn theo thứ tự catalog ⇒ cùng cấu hình luôn ra cùng chuỗi (E-19/§9). Đối chiếu chéo: `.sites-runtime/qa-customization.mjs:91` kỳ vọng đúng 2 topping bị khóa sau khi chọn 3 và kỳ vọng thứ tự catalog — khớp logic mới.

**g) Focus fallback / trap — ĐẠT (đóng L-06, L-07; đóng REV-201 của QA-202 ở mức mã).**
- `openCart()` tính `focusReturn` **trước** khi đóng hộp thoại (`app.js:480–482`) ⇒ sửa nửa sau của L-06 (mục tiêu trả focus không còn là control đã ẩn).
- `closeCustomization()` có fallback `customLastFocused && isConnected ? … : openCartButton` (`app.js:651`) ⇒ sửa nửa đầu của L-06.
- E-10 đã hiện thực: Escape khi cả hai class cùng có ⇒ đóng cả hai (`app.js:849–854`) ⇒ đóng L-07.
- **Mới:** `trapModalFocus()` (`app.js:521–547`) + wiring cho `custom-open` và `drawer-open` (`app.js:841–848`): chặn `Tab`/`Shift+Tab` ở hai mép, và nếu focus đang ở ngoài container thì kéo về `first`/`last`. Điều này làm T16.2 ("Tab không bao giờ rời `.custom-dialog`") đúng **kể cả** khi `<body>` vẫn là cha hợp lệ — tức đóng đúng REV-201 mà QA-202 nêu.
- Bộ lọc focusable chỉ loại theo `visibility/display`, nên các `.custom-input` 1×1 (cố ý) **vẫn** nằm trong vòng tab — đúng, vì ring được vẽ trên nhãn (`styles.css:1502`, `1534`). Khi container không còn control, `container.focus()` dùng `tabindex="-1"` có sẵn (`index.html:207`, `300`). Không thấy đường gây TypeError.
- Browser pending: thứ tự Tab thật và việc trả focus sau `Escape`/`Xem giỏ hiện tại`.

**h) Control "Xem giỏ hiện tại" — ĐẠT (đóng L-08; T12.3 nay thao tác được).** `index.html:286` `<button class="custom-cart-link" type="button" data-open-cart>Xem giỏ hiện tại</button>`; CSS `styles.css:1557–1568` (`min-height:44px`, kế thừa ring toàn cục `styles.css:189–194`); handler chung bắt `[data-open-cart]` (`app.js:737–740`) ⇒ gọi `openCart()`, mà `openCart()` đóng custom **trước** (`app.js:481`) rồi mới thêm `drawer-open` và focus nút đóng giỏ (`493–494`); `closeCustomization(false)` đã gỡ `inert` khỏi `.cart-drawer` (`app.js:649`) nên drawer không bị khóa. Bất biến một-overlay (AC-P12) giữ nguyên. Nit nhất quán: nút này thiếu `aria-haspopup="dialog"` trong khi nút giỏ ở header có (`index.html:35`) ⇒ **Low mới L-16**.

## 10.3 Cập nhật sổ Low (không xoá Low cũ)

**Đã đóng (7):** L-01 (`index.html:198` có `aria-hidden="true"`), L-03 (`app.js:200–203`), L-04 (`app.js:179–187`), L-06 (`app.js:480–482`, `651`), L-07 (`app.js:849–854`), L-08 (`index.html:286`), L-11 (`app.js:513–514` — có `instanceof HTMLElement`).

**Còn mở (5):** L-02 (vẫn không có `lineTotalOf`/`cartTotalOf`/`cartCountOf`/`mergeIntoCart`; quét `dist/` = 0 match, phép `unit × qty` còn lặp ở `301–307, 381, 591, 793`), L-05 (không có assert dev cho id topping; grep `assert|console.` trên `app.js` = 0 match), L-09 (câu copy giữ nguyên ở `app.js:804`), L-10 (không debounce; vẫn đúng **một** live region), L-12 (`option-pills--sugar`/`--ice` vẫn no-op — 0 quy tắc CSS; tick topping vẫn là ký tự `✓`, `index.html:267–271`).

**Low mới (4, không chặn static gate):**

| ID | Nội dung | Bằng chứng |
|---|---|---|
| **L-13** | `updateCustomizationUI()` và `addConfiguredToCart()` dùng kết quả `customDraftRecord()` mà không kiểm `null`, trong khi V10 mới **có thể** trả `null` (`app.js:588–591`, `661–662`). Hiện **không có đường tới được** từ UI (`customState.quantity` luôn bị kẹp 1…20 ở `709`/`715`; size/sugar/ice lấy từ radio tĩnh) — chỉ là hardening. | `app.js:200–203, 588, 661` |
| **L-14** | Nút `+` của **hàng trong giỏ** không bao giờ `disabled`/`aria-disabled` và tại 20 ly vẫn phát toast "Đã thêm một ly vào giỏ" dù số lượng đã kẹp ở `MAX_QTY`. Giá trị dữ liệu vẫn đúng; không AC-P/T nào phủ stepper hàng giỏ. | `app.js:407–413, 686–688` |
| **L-15** | Khi focus một hàng topping, ring được vẽ **hai lần**: trên `.topping-box` 24px (`styles.css:1502–1506`) và trên cả `.topping-item` (`1534–1538`) ⇒ 2 vòng lồng nhau. Không sai chuẩn (ring hàng mới là mục DES-C05 yêu cầu); cần xác nhận bằng mắt. | `styles.css:1502–1506, 1534–1538` |
| **L-16** | `.custom-cart-link` (`index.html:286`) mở dialog giỏ nhưng thiếu `aria-haspopup="dialog"` (nút giỏ ở header có). Thuần nhất quán AT. | `index.html:35, 286` |

## 10.4 Cập nhật ma trận (chỉ ghi phần đổi; §2–§3 giữ nguyên)

- **AC-P:** vẫn **17/22 Static PASS · 5 pending · 0 FAIL**. Không AC-P nào bị hạ cấp bởi các thay đổi M-01…M-04.
- **AC-P20 — vẫn Harness pending, nhưng bối cảnh bằng chứng đã đổi:** đã có **một** harness Playwright trong repo: `.sites-runtime/qa-customization.mjs` (164 dòng) — phủ overflow 5 viewport, target ≥44px, text bị cắt, console/pageerror, giới hạn 3 topping, gộp vs tách dòng, bất biến một-overlay, `.custom-cart-link`, vòng Tab 14 lần, storage bị sửa (`size:"constructor"`, `quantity:999`, `unitPrice:1`), reduced motion. **Nhưng:** (i) nó cần `PLAYWRIGHT_MODULE` + server `127.0.0.1:4173` và **chưa được chạy trong phiên này**; (ii) `test.mjs` T12–T20 của QA-201 (PM-002 §10.1, dòng `QA-201`, cột Deliverable "`test.mjs` (hoặc tập tin harness hiện hành)") **vẫn không tồn tại** — `glob **/*test*` = 0 tập tin, `glob **/*.mjs` = đúng 1 tập tin trên. ⇒ **Không tuyên bố bất kỳ tổng `NN/NN PASS` nào.**
- **T12.3:** từ "Static PASS (cơ chế) / không có control trong UI" → **Static PASS / Browser pending** — control `.custom-cart-link` đã tồn tại; đường đóng-rồi-mở đọc được ở `app.js:480–482, 649, 737–740`.
- **T16.2:** mô tả cũ ("Không có key-trap thủ công; cô lập bằng `inert`") **không còn đúng** với revision này: có `trapModalFocus` (`app.js:521–547, 841–848`). Vẫn Static PASS (cơ chế kín hơn), Browser pending.
- **DES-C05:** từ "Một phần" → **PASS** (`styles.css:1534–1538`); xem L-15 cho phần mỹ thuật. **DES-C09** vẫn "Một phần" (L-10). **DES-C10** vẫn "PASS (thiếu assert dev — L-05)".
- **H-V1:** cập nhật — "không có harness" nay là "có harness Playwright nhưng chưa chạy và chưa phải harness T1–T20 đầy đủ". **H-V2:** giữ nguyên (ma trận browser vẫn chưa chạy cho revision này).

## 10.5 Bằng chứng browser đã có sẵn trong repo — phạm vi hiệu lực

`docs/reviews/antigravity-customization-review.md` (QA-202) tuyên bố **FINAL GATE PASS · 0 High · 0 Medium · 2 Low**. Tài liệu đó **được giữ nguyên** (không sửa), nhưng **không thể kế thừa** cho revision hiện tại:

1. Hai dòng bằng chứng cụ thể của nó mô tả **bản build cũ hơn**: DES-C05 ghi ring chỉ trên `.topping-box` (`styles.css:1502–1506`) — revision này có thêm khối `.topping-item:has(...)` (`1534–1538`, +5 dòng, khớp độ lệch số dòng `stepper-button:disabled` 1548 → 1553); REV-201 nói vòng focus dựa **thuần** `inert` và `BODY` bị ghé 1 nhịp — revision này đã có `trapModalFocus`.
2. 12 kịch bản của QA-202 **không chạm** ba mục vừa sửa: `+` ở `MAX_QTY` trong hộp thoại (kịch bản 4 chỉ tới số lượng 2), dữ liệu storage bị sửa (M-02), và giỏ 20 dòng (M-04). Kể cả đúng revision, báo cáo đó cũng **không phủ** M-01/M-02/M-04.

⇒ Cần **một lượt browser mới** trên revision hiện tại. Đề xuất 3 ca bổ sung cho harness `.sites-runtime/qa-customization.mjs` trước khi dùng nó làm bằng chứng đóng gate: (a) đẩy số lượng hộp thoại tới 20 và kiểm `[data-custom-increase]` có `disabled` + `aria-disabled="true"`; (b) tạo đủ 20 dòng giỏ rồi mở hộp thoại cấu hình mới ⇒ `#add-configured-item` `disabled` + `#custom-status` có câu giới hạn; (c) tại một dòng giỏ đã 20 ly, bấm `+` ⇒ số lượng giữ 20 và toast **không** được nói "đã thêm" (gắn với L-14).

## 10.6 Kết luận static gate (mới)

- **0 High / 0 Medium tĩnh** trong `dist/` tại revision hiện tại. Điều kiện dừng "0 High và 0 Medium" của PM-002 §12.3 **được thoả ở mức tĩnh**: 4/4 Medium cũ (M-01…M-04) đã **FIXED**, không phát sinh High/Medium mới; static FAIL của AC-P/T = **0**.
- **Gate đầy đủ vẫn chưa đóng**, vì ba khoảng trống bằng chứng không thể lấp bằng đọc mã:
  1. **Browser cho revision hiện tại:** AC-P13 (tràn ngang 5 viewport), AC-P18 (delta nhãn chip), AC-P21 (console), T20.2/T20.4/T20.5, xác nhận trực quan DES-C05/L-15, và 3 ca bổ sung ở §10.5.
  2. **AC-P20:** chạy harness và ghi tổng `NN/NN PASS` (gồm T1–T11 cũ nếu muốn giữ mốc 55/55 — phiên này không chạy).
  3. **AC-P22:** `git diff` phạm vi — phiên này không chạy git; lưu ý nếu `.sites-runtime/qa-customization.mjs` được track thì nó nằm ngoài `dist/` + `docs/reviews/`, cần người có quyền git xác nhận.
- Không có Medium nào bị "hạ cấp" để đóng gate: L-13…L-16 đều là Low có lý do rõ (không AC-P/T phủ, hoặc không có đường tới được, hoặc thuần mỹ thuật/nhất quán AT). **L-14 là mục đáng sửa rẻ nhất cùng lúc với lượt browser** vì nó phát thông báo sai sự thật cho người dùng.

## 10.7 Handoff (recheck)

- **Task ID:** `QA-201` — recheck vòng 2 (tĩnh) sau các bản sửa của Codex.
- **Files changed:** chỉ `docs/reviews/customization-qa.md` (nối §10; §0–§9 nguyên vẹn). **Không** sửa `dist/`, `TASKS.md`, `docs/design-spec.md`, `docs/reviews/antigravity-customization-review.md`, `.sites-runtime/qa-customization.mjs`.
- **Checks run:** đọc lại toàn bộ `dist/index.html` (348), `dist/app.js` (881), `dist/styles.css` (1617); đọc `customization-product-plan.md` (B4/U3/U4/V3/V9/V10/E-13/E-17/E-20/DES-C05), `antigravity-customization-review.md`, `.sites-runtime/qa-customization.mjs`; quét `dist/` bằng regex (`hasOwnProperty`, `MAX_CART_LINES`, `trapModalFocus`, `instanceof HTMLElement`, `option-pills--`, `lineTotalOf|cartTotalOf|cartCountOf|mergeIntoCart`, `assert|console.`); `glob **/*test*` (0) và `glob **/*.mjs` (1). **Không** chạy browser, git, harness hay subagent.
- **Kết quả:** M-01…M-04 **FIXED**; Low đóng 7 (L-01/03/04/06/07/08/11); Low còn mở 5 (L-02/05/09/10/12); Low mới 4 (L-13…L-16). **0 High / 0 Medium tĩnh.**
- **Remaining risks / decisions:** L-14 (thông báo sai khi `+` ở dòng giỏ đã 20) và L-15 (2 vòng ring) nên được xử lý trong cùng lượt sửa/đo tiếp theo; bằng chứng QA-202 trong repo là **stale** so với revision này và cần chủ sở hữu cập nhật; `BIZ-003` vẫn mở (mọi phụ thu phải giữ nhãn "minh hoạ").
- **Recommended next owner:** **Codex** (3 ca harness ở §10.5 + cân nhắc L-14/L-13) → **Antigravity/Codex** chạy browser evidence cho revision hiện tại → **DeepSeek** chạy harness và ghi tổng `NN/NN PASS` trước khi đóng Phase 7.

---

# 11. Chốt QA-201 — evidence sau §10 (revision `scripts/qa-customization.mjs`)

**Revision đọc trong phiên này:** `dist/index.html` (348 dòng), `dist/app.js` (**885 dòng**), `dist/styles.css` (**1618 dòng**), `scripts/qa-customization.mjs` (201 dòng), `.sites-runtime/qa-customization.mjs` (164 dòng, bản cũ). §10 đọc 348/881/1617 — mọi số dòng trong §0–§10 là **lịch sử audit, không viết lại**.

**Ràng buộc phiên:** không chạy shell, không chạy trình duyệt, không chạy harness, không gọi subagent; **không sửa** `dist/`, `TASKS.md`, `docs/design-spec.md`, tài liệu của Codex/Antigravity hay harness. Thay đổi duy nhất: **nối thêm §11 này**.

> **Phân định nguồn bằng chứng (bắt buộc đọc trước khi trích dẫn).**
>
> | Nguồn | Nội dung | Ai tạo ra |
> |---|---|---|
> | **Tĩnh — phiên này** | Số dòng revision, đọc `dist/app.js`/`styles.css`/`index.html`, đối chiếu `scripts/qa-customization.mjs` với §10 | DeepSeek Harness (QA-201) |
> | **Browser — do coordinator cung cấp** | §8 của `docs/reviews/antigravity-customization-review.md`: focus trap không ghé `BODY` ở 390/1440, outline topping toàn hàng, overlay đúng, console 0 | Antigravity (QA-202), **không phải phiên này chạy** |
> | **Harness — do coordinator cung cấp** | `scripts/qa-customization.mjs`: **71/71 PASS** | Codex, **không phải phiên này chạy** |
>
> §11 **không tự nhận** đã chạy browser hay harness. Cả hai con số trên là **báo cáo do coordinator truyền lại**; QA-201 chỉ xác minh **tính khớp nguồn** (script có đúng 71 lời gọi `check()`; script chứa đúng các ca phủ 4 Medium cũ) chứ không tái lập kết quả.

## 11.1 Sửa nhận định stale của §10

| Nhận định cũ | Trạng thái | Bằng chứng hiện tại |
|---|---|---|
| §10.4/§10.6: "`test.mjs` T12–T20 **vẫn không tồn tại**"; H-V1: "harness chưa chạy" | **STALE** | Codex đã thêm `scripts/qa-customization.mjs` (201 dòng) và đã chạy: **71/71 PASS** (nguồn: coordinator). Đây **không** phải `test.mjs` T1–T20 đầy đủ của PM-002 §10.1, nên **không** kế thừa hay thay thế mốc 55/55 T1–T11. |
| §10.5: cần "một lượt browser mới" cho revision hiện tại | **ĐÃ CÓ** | §8 của `antigravity-customization-review.md` đã được Antigravity cập nhật cho bản build mới: 390/1440 không ghé `BODY`, outline toàn hàng, overlay đúng, console 0 (nguồn: coordinator). **Không** kế thừa các số đo 320/768/1024 của §3–§4 (lượt cũ). |
| §10.5/§10.6: 3 ca browser đề xuất (a)(b)(c) chưa có | **ĐÃ CÓ** | (a) `[data-increase]:disabled` ở 20 ly — `qa-customization.mjs:167`; (b) 20 dòng giỏ ⇒ CTA disabled + `#custom-status` "20 cấu hình" — `:194–195`; (c) tại 20 ly, `+` vẫn kẹp 20 (kèm hardening **L-14**, xem §11.3). |
| §10.3: L-14 (`+` hàng giỏ không disabled + toast "đã thêm" sai) | **ĐÓNG trong phiên bản này (tĩnh)** | `cartRow()` render `disabled aria-disabled="true"` khi `quantity >= MAX_QTY` (`app.js:412`); `addConfiguredToCart()` phát "Cấu hình này đã đạt tối đa 20 ly" thay vì "đã thêm" (`app.js:679–681`); harness `:167`. |
| §10.3: L-16 (`.custom-cart-link` thiếu `aria-haspopup`) | **ĐÓNG** | `index.html:286` nay có `aria-haspopup="dialog"`. |
| §10.5 kết luận QA-202 là **stale** | **Sửa một nửa** | Phần **recheck** (§8) nay khớp revision; phần **§1–§7** vẫn mô tả bản build cũ theo số dòng (xem §11.4). |

## 11.2 Static gate — 0 High / 0 Medium

**Kết luận tĩnh của QA-201 trên revision hiện tại: 0 High · 0 Medium.** 4/4 Medium cũ (M-01…M-04) giữ nguyên trạng thái **FIXED**; các thay đổi của Codex sau §10 **không** làm hồi quy mục nào. Điều kiện dừng "0 High và 0 Medium" của PM-002 §12.3 **thoả ở mức tĩnh**.

Đối chiếu điểm rời rạc (không hồi quy):

- **M-02 (size prototype):** harness `:149–150` kiểm `Size M` + không `NaN`/`undefined`; giữ xanh cùng `app.js:196, 212, 221`.
- **M-04 (20 dòng):** harness `:194–195` kiểm CTA `disabled` + câu "20 cấu hình"; giữ xanh cùng `app.js:611–623, 667`.
- **M-01 (`+` ở 20 trong hộp thoại):** cơ chế giữ nguyên (`app.js:606–609`); chưa có ca harness đẩy hộp thoại tới 20 (vẫn là lỗ hổng bằng chứng **mức Low**, xem §11.5).
- **M-03 (focus toàn hàng topping):** luật `.topping-item:has(.custom-input:focus-visible)` nay tại `styles.css:1535–1539` (dịch 1 dòng so với §10 do `styles.css` tăng 1 dòng); nội dung khai báo không đổi.

**Không** có mục nào bị "hạ cấp" để đóng gate; L-02/05/09/10/12 vẫn mở nguyên như §10.3 (tĩnh).

## 11.3 Harness `scripts/qa-customization.mjs` — 71/71 PASS (do coordinator cung cấp)

- **Nguồn & cách chạy:** `scripts/qa-customization.mjs`; `DUDU_BASE_URL` mặc định `http://127.0.0.1:4173/`; cần `PLAYWRIGHT_MODULE` (mặc định `playwright`) và `BROWSER_EXECUTABLE`; script in `{checks, failures, details}` và `exitCode = 1` nếu có fail (`:200–201`).
- **Kết quả:** **71/71 PASS, 0 fail** — nguồn coordinator (Codex). **QA-201 không chạy lại.**
- **Xác minh tĩnh tính khớp "71":** đếm `check()` trong script = **71** (6 ca × 5 viewport = 30; giỏ rỗng 8; luồng tương tác 15; storage bị sửa + reduced motion 4; 20 dòng giỏ 2). Con số 71 khớp cấu trúc script.
- **Phạm vi phủ:** tràn ngang + `scrollWidth === clientWidth` + phần tử vượt mép + target ≥44px + nhãn bị cắt + console/pageerror ở **5 viewport** (`:39–68`); trap focus **giỏ rỗng** 8 nhịp Tab (`:78–82`); luồng cấu hình → giá 134.000 → gộp dòng (SL 3) → tách dòng (2 dòng) → chuyển overlay qua `.custom-cart-link` → Escape → focus ban đầu Size M → 14 nhịp Tab không thoát dialog → trả focus về nút món (`:96–145`); storage bị sửa `size:"constructor"`/`quantity:999`/`unitPrice:1` ⇒ `Size M`, không `NaN`, kẹp 20, `[data-increase]:disabled` (`:153–167`); reduced motion `1e-05s` (`:170–174`); giỏ 20 dòng ⇒ CTA disabled + câu "20 cấu hình" (`:194–195`).
- **Bản mới so với `.sites-runtime/qa-customization.mjs` (164 dòng):** thêm (i) ca **giỏ rỗng** — đóng khiếm khuyết Antigravity nêu ở §8 mục 3 ghi chú drawer; (ii) `recordConsoleError()` bỏ qua lỗi mạng `ERR_NETWORK_CHANGED|ERR_INTERNET_DISCONNECTED` (`:16–21`); (iii) ca `[data-increase]:disabled` ở 20 ly (`:167`); (iv) ca 20 dòng giỏ (`:178–197`); (v) `.custom-cart-link` vào danh sách target ≥44px (`:40`). Harness cũ trong `.sites-runtime/` **không còn là bản tham chiếu**.

## 11.4 Browser gate — PASS theo §8 (do coordinator cung cấp)

`docs/reviews/antigravity-customization-review.md` §8 nay ghi cho bản build mới, tại **390 × 844** và **1440 × 900**: vòng Tab khép kín **không ghé `BODY`**, `Shift+Tab`/`Tab` ở hai mép nhảy đúng; outline toàn hàng topping `3px solid rgb(53,7,31)` + halo 5px; `Tab` từ `.custom-cart-link` và overlay "Xem giỏ hiện tại" đóng/mở đúng bất biến; **console 0 error / 0 pageerror**. QA-201 ghi nhận đây là **browser gate PASS do coordinator cung cấp**, không tự chạy.

**Không kế thừa:** các số đo **320 / 768 / 1024** của §3–§4 lượt đầu; các con số kịch bản 1–12 của §4 (bản build cũ); tổng "12/12 kịch bản".

**Ghi chú nhất quán số dòng (không phải finding):** §8 trích `.topping-item:has(...)` tại `styles.css:1534–1538`; revision này là `1535–1539` (file +1 dòng sau §10). Cùng nội dung CSS, lệch 1 dòng — khi trích dẫn nên dùng số mới.

## 11.5 Việc còn mở sau chốt (không chặn static gate)

1. **BIZ-003 vẫn MỞ** (`TASKS.md:40`, `Needs owner decision`): size/thể tích/mức đường-đá/danh mục topping và phụ thu thật chưa được chủ quán xác nhận bằng văn bản. Hệ quả bắt buộc: **giữ nguyên nhãn "minh hoạ"** ở mọi phụ thu và không gọi đây là tuỳ chọn/giá chính thức. Tương ứng REV-202 của QA-202 **vẫn OPEN**.
2. **L-02 / L-05 / L-09 / L-10 / L-12** vẫn mở như §10.3 (tĩnh): chưa có `lineTotalOf|cartTotalOf|cartCountOf|mergeIntoCart` trong `dist/` (0 match); không có assert dev cho topping id; câu copy "…xác nhận giá và kênh nhận đơn…" giữ nguyên; không debounce `role="status"`; `option-pills--sugar|--ice` no-op.
3. **Bằng chứng mức Low còn thiếu:** chưa có ca harness đẩy **số lượng trong hộp thoại tới 20** để khẳng định `[data-custom-increase]` có `disabled` + `aria-disabled="true"` (M-01 chỉ được xác nhận bằng đọc mã). Đề xuất thêm 1 ca vào `scripts/qa-customization.mjs`.
4. **AC-P20 vẫn chưa có `NN/NN` cho T1–T20:** 71/71 là của harness tuỳ chỉnh mới, **không** phải `test.mjs` T1–T20; mốc 55/55 T1–T11 trong `TASKS.md:7` không được tự động cộng vào.
5. **AC-P22 (`git diff`):** phiên này **không** chạy git; phạm vi thay đổi vẫn cần người có quyền git xác nhận (gồm việc `scripts/qa-customization.mjs` nằm ngoài `dist/` + `docs/reviews/`).

## 11.6 Handoff (§11)

- **Task ID:** `QA-201` — chốt evidence sau §10.
- **Files changed:** chỉ `docs/reviews/customization-qa.md` (nối §11; §0–§10 nguyên vẹn). **Không** sửa `dist/`, `TASKS.md`, tài liệu Antigravity/Codex, `scripts/qa-customization.mjs`, `.sites-runtime/qa-customization.mjs`.
- **Checks run (phiên này, chỉ tĩnh):** đọc `dist/index.html` (348), `dist/app.js` (885), `dist/styles.css` (1618), `scripts/qa-customization.mjs` (201), `.sites-runtime/qa-customization.mjs` (164), `TASKS.md`, `dist/reviews/…` (hai báo cáo); quét `dist/` (`getClientRects`, `trapModalFocus`, `MAX_CART_LINES`, `aria-haspopup`, `summary-h`, `lineTotalOf|cartTotalOf|cartCountOf|mergeIntoCart`); đếm `check()` = 71. **Không** chạy shell, browser, harness hay subagent.
- **Kết quả:** static gate **0 High / 0 Medium**; browser gate **PASS** (theo §8, coordinator cung cấp); harness **71/71 PASS** (theo coordinator cung cấp); L-14 và L-16 đóng thêm; **BIZ-003 còn mở**.
- **Remaining risks / decisions:** mọi con số runtime ở §11 là **báo cáo truyền lại**, chưa được QA-201 tái lập; AC-P20/AC-P22 vẫn chưa có bằng chứng đầy đủ; nhãn "minh hoạ" phải giữ tới khi BIZ-003 được chốt.
- **Recommended next owner:** **Codex** (1 ca harness cho `+` ở 20 trong hộp thoại; cân nhắc L-02/L-10) → **DeepSeek** (đối chiếu `git diff` phạm vi AC-P22 và ghi tổng T1–T20 nếu cần) → **Human owner** (BIZ-003).
