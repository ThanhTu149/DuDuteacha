# Báo cáo Art Direction & Thiết kế Sản phẩm "DuDu UX/UI Pro Max"

**Người thực hiện:** Antigravity — Art Director & Senior Product Designer  
**Dự án:** DuDu Milk Tea (Sài Gòn — Khách hàng mục tiêu: Gen Z)  
**Môi trường đánh giá:** Trình duyệt thực tế (Microsoft Edge / Chromium engine) tại `http://127.0.0.1:4173/`  
**Ngày thực hiện:** 2026-09-30  
**Tập tin bàn giao:** `docs/reviews/antigravity-art-direction.md`  
**Quy tắc tuân thủ:** Không sửa code trong `dist/`; không bịa đặt thông tin kinh doanh (địa chỉ, giờ mở cửa, số điện thoại, review); giữ trọn vẹn nhận diện cốt lõi (Plum, Cream, Pink, Lime; Fraunces & Be Vietnam Pro; giọng văn ấm, trẻ, gọn).

---

## Tóm tắt Đánh giá Thực tế qua Trình duyệt (Executive Summary)

Trong đợt review này, Antigravity đã trực tiếp khởi chạy kịch bản tự động hóa trình duyệt qua Playwright/Edge để đo lường thông số render thật, kiểm tra tương tác giỏ hàng, bộ lọc menu, và chụp ảnh trực tiếp trên **5 viewport bắt buộc**:
1. **320 × 568 px** (Mobile siêu nhỏ / iPhone SE đời đầu)
2. **390 × 844 px** (Mobile tiêu chuẩn / iPhone 12/13/14)
3. **768 × 1024 px** (Tablet dọc / iPad Portrait)
4. **1024 × 768 px** (Tablet ngang / Laptop màn hình nhỏ)
5. **1440 × 900 px** (Desktop chuẩn / MacBook Pro)

### 3 Phát hiện Khiếm khuyết Nghiêm trọng Nhất từ Trình duyệt Thật
1. **Lỗi Chiều cao Hero Visual 1024px trên mọi Viewport (Layout Bug nghiêm trọng nhất):**  
   Thuộc tính HTML `height="1024"` trên thẻ `<img>` (`dist/index.html:56`) không bị ghi đè vì trong CSS (`dist/styles.css:36, 146`) thiếu khai báo `height: auto;`. Kết quả là trên **cả 5 viewport**, ảnh hero luôn bị ép cố định chiều cao đúng **1024px**! Tại viewport mobile 320px và 390px, ảnh biến thành một "tháp ảnh" cao gấp đôi chiều cao màn hình điện thoại (1024px trên màn hình 568px), cắt nát bộ ba ly trà và ép người dùng phải cuộn mỏi tay. Tại tablet 768px, ảnh chiếm trọn 1024px chiều dọc; tại desktop 1440px, ảnh bị biến dạng tỷ lệ thành hình chữ nhật đứng (590 × 1024 px), cắt cụt hoàn toàn ly Matcha bên phải.
2. **Xung đột Toast Notification đè lên Nút Hành động trong Giỏ hàng (UX Blocker trên Mobile):**  
   Khi thêm món và mở giỏ hàng tại 320px và 390px, thanh thông báo Toast (`#toast`) với `z-index: 110` xuất hiện ở đáy màn hình (`bottom: 24px; left: 50%`) và **nằm đè trực tiếp lên nút chính "Sao chép đơn hàng"** (`#copy-order`). Người dùng không thể bấm sao chép đơn trong suốt thời gian toast hiển thị (1.8 giây), gây ức chế và cản trở luồng chuyển đổi chính.
3. **Đứt gãy Nhịp Typography Tiếng Việt và Dấu Chồng trên Mobile 320px:**  
   Tại 320px, tiêu đề Hero `h1` bị ngắt dòng vụn thành 3 dòng ("Vui từ" / "ngụm" / "đầu.") làm rời rạc cụm từ "ngụm đầu". Đồng thời, tiêu đề Story `h2` với kích thước tối thiểu clamp `3.4rem` (54.4px) bị ép vào khung 228px, vỡ nát thành **5 dòng chữ khổng lồ** với từ cụt "kỳ." mồ côi ở dòng cuối. Dấu nặng của từ "ngụm" và dấu chồng mũ+huyền của từ "đầu" chỉ cách nhau ~2.5px ở line-height 1.08, sát mép va chạm.

---

## 20 Mục Đề xuất Art Direction & Thiết kế Sản phẩm "DuDu UX/UI Pro Max"

---

### 1. Design Concept Tổng thể: "Playful Editorial & Tangible Craft"

- **Vấn đề hiện tại:** Trang web hiện tại có màu sắc tươi nhưng bố cục còn mang tính chất một landing page thử nghiệm, thiếu chiều sâu thương hiệu ("depth of brand") để khách hàng Gen Z cảm nhận được đây là một thương hiệu trà sữa thủ công cao cấp, trẻ trung và thời thượng tại Sài Gòn.
- **Tác động đến người dùng:** Người dùng ghé thăm thấy đẹp mắt nhưng chưa cảm nhận được sự kích thích vị giác mạnh mẽ hay mong muốn chia sẻ (shareable / Instagrammable).
- **Selector/Component liên quan:** Toàn bộ layout (`body`, `.hero`, `.menu-section`, `.story-section`).
- **Cách cải thiện cụ thể:**  
  Xây dựng concept **"Playful Editorial & Tangible Craft"** (Phong cách Tạp chí Trẻ trung & Thủ công Xúc giác):
  1. *Playful Editorial:* Sử dụng kiểu chữ tiêu đề Fraunces với sự phóng khoáng có chủ đích, tương phản mạnh với kiểu chữ Be Vietnam Pro sắc sảo, kết hợp nhịp điệu typography bất đối xứng lấy cảm hứng từ các tạp chí văn hóa đường phố TP.HCM.
  2. *Tangible Craft:* Tôn vinh tính xúc giác của nguyên liệu (lá trà thật, sữa béo mượt, trân châu dẻo óng, hoa quả tươi). Đồ hoạ minh hoạ và ảnh chụp phải toát lên cảm giác mát lạnh, giọt nước đọng trên ly, lớp kem mặn sánh mịn.
  3. *Micro-delight:* Từng nút bấm, từng thao tác tăng giảm số lượng món đều có phản hồi vật lý nhẹ nhàng (elastic bounce, haptic-like scaling).
- **Cách kiểm chứng:** Cảm xúc người dùng qua thử nghiệm phỏng vấn: nhận diện được cá tính riêng của DuDu trong vòng 3 giây đầu tiên, không nhầm lẫn với các chuỗi trà sữa công nghiệp.

---

### 2. Visual Hierarchy (Phân cấp Thị giác)

- **Vấn đề hiện tại (Quan sát thực tế trên browser):**  
  - Trên mobile (320px & 390px): Tỷ lệ giữa tiêu đề (`h1` 56px - 66px) và ảnh hero (cao 1024px) hoàn toàn lấn át các thành phần phụ. Ảnh chiếm đến 70% diện tích màn hình đầu tiên khi cuộn.
  - Trên desktop (1440px): Khoảng cách trắng giữa Header và Hero quá hẹp (`margin: 12px auto 34px`), khiến mắt người dùng bị hút ngay vào ảnh mà bỏ quên thanh điều hướng và thông điệp thương hiệu.
  - Dòng text phụ trong Menu ("Giá đang là nội dung minh hoạ.") bị nhét vào thẻ `<small>` mờ nhạt, trong khi giá tiền từng món lại rất đậm.
- **Tác động đến người dùng:** Người dùng bị "ngợp hình ảnh", khó tập trung vào hành động cốt lõi là đọc menu và chọn món theo mood.
- **Selector/Component liên quan:** `.hero`, `.hero-copy`, `.hero-visual`, `.section-heading`.
- **Cách cải thiện cụ thể:**  
  1. *Cấp 1 (Primary Focal Point):* Tiêu đề Hero "Vui từ ngụm đầu." và hình ảnh bộ ba ly trà được cân bằng tỷ lệ 1 : 1 về diện tích thị giác trên desktop, và tỷ lệ 1 : 0.8 trên mobile.
  2. *Cấp 2 (Action Drivers):* Nút CTA "Chọn món ngay" (Plum pill) và cụm lọc Menu chips (Lime pill).
  3. *Cấp 3 (Discovery Content):* Danh sách thẻ món với hình minh hoạ trực quan, giá niêm yết rõ ràng.
  4. *Cấp 4 (Supporting Context):* Ticker chạy chữ, Câu chuyện thương hiệu, Thông tin ghé quán.
- **Cách kiểm chứng:** Kiểm tra sơ đồ nhiệt (Heatmap eye-tracking simulation): mắt người dùng dừng tại Tiêu đề -> lướt sang Bộ 3 ly trà -> dừng tại CTA Chọn món -> cuộn êm xuống Menu.

---

### 3. Typography Scale cho Tiếng Việt (Thang Đo & Xử lý Dấu Chồng)

- **Vấn đề hiện tại (Đo đạc chính xác trên trình duyệt):**  
  1. `.hero h1`: `line-height: 1.08`, `letter-spacing: -0.02em`. Tại 320px, cỡ chữ là 56px với chiều cao dòng 60.48px. Khi "ngụm" và "đầu." bị bẻ làm 2 dòng: chữ `g` và dấu nặng `ụ` của "ngụm" nằm ngay sát đỉnh dấu mũ và huyền `ầ` của "đầu.", khoảng cách thực tế chỉ vỏn vẹn **2.5px**.
  2. `.story-main h2`: `line-height: 1.16`. Tại 320px, cỡ chữ tối thiểu clamp là 54.4px (`3.4rem`). Nội dung bị bẻ vụn thành 5 dòng: "Một ly / vui, / không / cần cầu / kỳ.", từ "kỳ." bị cô lập (orphan).
  3. `.story-quote blockquote`: `line-height: 1.1`. Cụm từ "Một ngụm dịu vị, cả ngày thêm vui." có dấu nặng của `dịu vị` gần như chạm vào dấu móc của `thêm` ở dòng tiếp theo.
  4. `.stat-number`: `letter-spacing: -0.08em`. Tại 1440px, cỡ chữ 100.8px làm khoảng cách chữ bị âm đến **-8.06px**, khiến số `0` và `6` dính chặt vào nhau, mất thẩm mỹ.
- **Tác động đến người dùng:** Chữ tiếng Việt bị dính dấu, khó đọc, tạo cảm giác thiếu chuyên nghiệp trong thiết kế chữ bản địa.
- **Selector/Component liên quan:** `.hero h1`, `.hero h1 em`, `.story-main h2`, `.story-quote blockquote`, `.stat-number`, `.menu-card h3`.
- **Cách cải thiện cụ thể:**  
  Thiết lập thang Typography Scale chuyên biệt cho tiếng Việt với line-height an toàn cho dấu thanh:

| Cấp bậc | Font & Trọng số | Mobile (320–390px) | Tablet (768px) | Desktop (1440px) | Line-height | Letter-spacing | Ghi chú dấu tiếng Việt |
|---|---|---|---|---|---|---|---|
| **Display 2XL** (Hero Title) | Fraunces 700/800 | 40px (2.5rem) – 46px (2.875rem) | 60px (3.75rem) | 84px (5.25rem) | **1.18 – 1.22** | `-0.02em` | Thoát dấu nặng `ụ` và dấu chồng `ầ`, không ngắt cụm "ngụm đầu" |
| **Display XL** (Section H2) | Fraunces 700 | 32px (2rem) – 36px (2.25rem) | 44px (2.75rem) | 64px (4rem) | **1.22** | `-0.02em` | Thông thoáng cho "uống gì?" có dấu sắc và hỏi |
| **Display L** (Story H2) | Fraunces 700 | 30px (1.875rem) – 34px (2.125rem) | 42px (2.625rem) | 56px (3.5rem) | **1.24** | `-0.015em` | Hạ floor clamp từ 54.4px xuống 30px để hết rớt chữ "kỳ." |
| **Display M** (Card / Drawer H3) | Fraunces 700 | 20px (1.25rem) – 22px (1.375rem) | 24px (1.5rem) | 26px (1.625rem) | **1.25** | `-0.01em` | Giữ tên món gọn gàng 1-2 dòng |
| **Stat Display** (Con số 06) | Fraunces 400 | 56px (3.5rem) | 72px (4.5rem) | 96px (6rem) | **1.0** | **`-0.03em`** (thay vì `-0.08em`) | Tách rời số 0 và 6 rõ ràng |
| **Body L** (Hero Lede) | Be Vietnam Pro 400 | 15px (0.938rem) | 16px (1rem) | 18px (1.125rem) | **1.6** | `normal` | Hậu vị rõ, dễ đọc |
| **Body M** (Card Desc / Body) | Be Vietnam Pro 400/500 | 14px (0.875rem) | 14.5px | 15px (0.938rem) | **1.55** | `normal` | Dễ chịu khi đọc lướt |
| **Eyebrow / Badge** | Be Vietnam Pro 800 | 11px (0.688rem) | 12px (0.75rem) | 12px (0.75rem) | **1.4** | `+0.12em` | Viết hoa, tương phản cao |

- **Cách kiểm chứng:** Đo kiểm khoảng cách giữa điểm thấp nhất của descender dòng trên và điểm cao nhất của diacritic dòng dưới: đạt tối thiểu 6px trên màn hình 1x.

---

### 4. Color System và Contrast (Bảng Màu & Độ Tương Phản WCAG)

- **Vấn đề hiện tại (Kết quả tính toán toán học WCAG 2.1/2.2 thực tế):**  
  1. Biểu tượng nụ cười trong giỏ hàng trống (`.cart-empty > span`): Màu `--pink: #f06a8a` trên nền `--paper: #fffaf0` đạt tỷ lệ **2.83 : 1** -> **TRƯỢT** WCAG 2.1 1.4.11 Non-text Contrast (yêu cầu ≥ 3.0 : 1).
  2. Viền nét focus của toàn trang (`:focus-visible`): Sử dụng `outline: 3px solid var(--pink)` (`#f06a8a`). Khi focus vào các phần tử trên nền Paper hoặc Cream, độ tương phản chỉ đạt **2.72 : 1 – 2.83 : 1** -> **TRƯỢT** tiêu chuẩn WCAG 2.2 2.4.13 Focus Appearance (yêu cầu ≥ 3.0 : 1).
  3. Mô tả món trên nền thẻ Caramel (`.menu-card[data-tone="caramel"] p`): Màu chữ `--muted: #765867` trên nền `#f7dfbc` đạt **4.83 : 1**, tuy qua mức AA (4.5:1) nhưng sát nút và rất mờ khi xem ngoài trời nắng.
- **Tác động đến người dùng:** Người dùng khiếm thị, người cận thị hoặc người lướt web trên điện thoại ngoài trời khó nhận biết trạng thái focus và biểu tượng trạng thái rỗng.
- **Selector/Component liên quan:** `:focus-visible`, `.cart-empty > span`, `.menu-card p`, `.cart-button`.
- **Cách cải thiện cụ thể:**  
  1. Đổi token focus toàn hệ thống:
     ```css
     :focus-visible {
       outline: 3px solid var(--pink-ink); /* #bd2854 - đạt 5.39:1 trên cream, 5.61:1 trên paper */
       outline-offset: 3px;
     }
     ```
  2. Nụ cười giỏ hàng trống: Đổi sang `var(--pink-ink)` (`#bd2854`) hoặc `var(--plum)` (`#5a1236`) để đạt tỷ lệ tương phản vượt chuẩn (> 5.6 : 1).
  3. Thẻ menu caramel: Tăng độ đậm của text mô tả từ 400 lên 500 hoặc điều chỉnh nhẹ nền `#f7dfbc` lên `#fae7cc` để đạt tỷ lệ tương phản an toàn ≥ 5.2 : 1.
  4. Đạt chuẩn AAA cho các CTA chính: Nút "Chọn món ngay" (13.34:1) và nút "Giỏ hàng" (17.50:1) hiện tại đã đạt AAA xuất sắc, cần giữ nguyên.
- **Cách kiểm chứng:** Chạy script tính toán lumen relative và kiểm tra tự động qua Lighthouse Accessibility: đạt điểm tuyệt đối 100/100.

---

### 5. Spacing System (Hệ Thống Khoảng Cách & Nhịp Điệu Dọc)

- **Vấn đề hiện tại (Quan sát thực tế trên browser):**  
  - Khoảng cách padding giữa các section trên desktop là `130px 0` (`styles.css:159`), tạo ra cảm giác "đứt gãy" giữa Ticker và Menu, và giữa Menu và Story.
  - Trên mobile 320px: Padding thẻ Story là `34px 26px`, chiếm mất 52px chiều ngang, bóp nghẹt nội dung bên trong.
  - Khoảng hở trong giỏ hàng: Khi có 2 món, danh sách món chiếm ~160px, sau đó là một khoảng trống mênh mông trước khi đến phần Tạm tính (`cart-summary`), làm giao diện bị loãng.
- **Tác động đến người dùng:** Trải nghiệm cuộn trang bị ngắt quãng, thiếu sự liền mạch, lãng phí không gian dọc trên điện thoại.
- **Selector/Component liên quan:** `.menu-section`, `.visit-section`, `.story-section`, `.cart-drawer`, `.cart-items`.
- **Cách cải thiện cụ thể:**  
  Quy chuẩn hệ spacing 8-point base token:
  - Spacing micro: 4px (`2xs`), 8px (`xs`), 12px (`sm`), 16px (`md`), 24px (`lg`), 32px (`xl`), 48px (`2xl`), 64px (`3xl`), 80px (`4xl`).
  - Section vertical rhythm:
    + Desktop (1440px): `padding: 80px 0` (thay vì 130px) để giữ sự tập trung liên tục.
    + Tablet (768px): `padding: 64px 0`.
    + Mobile (320px/390px): `padding: 48px 0` (thay vì 92px).
  - Giỏ hàng: Thiết lập `max-height` linh hoạt cho danh sách món, gom phần Tạm tính thành một card nổi có nền màu kem nhẹ (`#fff5df`) để gắn kết thị giác.
- **Cách kiểm chứng:** Đo bằng công cụ Grid Overlay của trình duyệt, khoảng cách giữa các khối luôn là bội số của 8px.

---

### 6. Grid và Responsive Strategy (Chiến Lược Lưới & Đáp Ứng)

- **Vấn đề hiện tại (Quan sát thực tế trên browser):**  
  - Tại breakpoint 980px (`styles.css:252`): Bố cục hero nhảy đột ngột từ 2 cột sang 1 cột xếp chồng, nhưng padding vẫn giữ ở mức 60px khiến layout bị phình to bất thường trên tablet ngang 1024px vs tablet dọc 768px.
  - Tại 320px: Header bị co rút quá mức, logo và nút giỏ hàng chen chúc trong 292px chiều rộng khả dụng (`width: calc(100% - 28px)`).
- **Tác động đến người dùng:** Trải nghiệm chuyển đổi giữa các thiết bị xoay ngang/dọc (orientation change) bị giật cục, bố cục không tối ưu theo diện tích ngón tay thao tác.
- **Selector/Component liên quan:** `.site-header`, `.hero`, `.menu-grid`, `.story-section`.
- **Cách cải thiện cụ thể:**  
  Áp dụng chiến lược Fluid Container với 4 breakpoint rành mạch:
  1. `Small Mobile (< 360px)`: Outer margin 12px, single column, typography scale nhỏ hơn 1 nấc, ưu tiên touch target.
  2. `Standard Mobile (360px – 640px)`: Outer margin 16px, single column card, compact header.
  3. `Tablet (641px – 1024px)`: Outer margin 24px, 2 cột menu (`grid-template-columns: repeat(2, 1fr)`), hero 2 cột thu gọn (tỷ lệ 1 : 1).
  4. `Desktop (> 1024px)`: Max-width 1280px, 3 cột menu, hero 2 cột tỷ lệ vàng 1 : 1.15.
- **Cách kiểm chứng:** Kiểm tra resize trình duyệt mượt mà từ 320px đến 1920px không hề có thanh cuộn ngang, không giật nhảy layout.

---

### 7. Header & Navigation UX/UI

- **Vấn đề hiện tại (Bằng chứng chụp thực tế trên browser `320-header.png` & `desktop-1440-full.png`):**  
  - Trên mobile (320px & 390px): Thanh điều hướng `.desktop-nav` bị đẩy xuống dòng 2 (`order: 3; width: 100%`). Ba liên kết "Menu", "Chuyện DuDu", "Ghé quán" chỉ là text trần với chiều cao click ~20px, hoàn toàn vi phạm chuẩn ngón tay tối thiểu 44 × 44 px của Apple HIG và WCAG 2.5.5!
  - Trên desktop (1440px): Font chữ menu quá nhỏ (0.92rem) và màu nhạt (`--muted: #765867`), không có trạng thái nhận biết trang đang ở mục nào (active scrollspy).
- **Tác động đến người dùng:** Người dùng mobile rất khó chạm trúng link, dễ bấm nhầm giữa "Chuyện DuDu" và "Ghé quán".
- **Selector/Component liên quan:** `.site-header`, `.desktop-nav`, `.desktop-nav a`, `.cart-button`.
- **Cách cải thiện cụ thể:**  
  1. *Mobile Navigation Bar:* Biến dòng 2 trên mobile thành thanh trượt pill bar chuyên nghiệp: mỗi link bọc trong pill chip có nền mờ nhẹ (`background: rgba(90,18,54,0.06)`), chiều cao tối thiểu **40px**, `padding: 8px 16px`, bo tròn 999px.
  2. *Desktop Navigation:* Tăng cỡ chữ lên `1rem (16px)`, trọng số 600, màu `#5a1236`, gạch chân micro-interaction chuyển động êm khi hover.
  3. *Cart Button:* Bổ sung hiệu ứng badge "nảy" (bounce) khi số lượng giỏ hàng nhảy từ 0 lên 1, kích thích cảm xúc mua hàng của Gen Z.
- **Cách kiểm chứng:** Kiểm tra diện tích touch target trên thiết bị di động: đạt tối thiểu 44 × 44 px bao gồm cả vùng đệm chạm (hitbox).

---

### 8. Hero Composition (Bố Cục Khu Vực Hero)

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `mobile-320-hero.png`, `tablet-768-hero.png`, `desktop-1440-hero.png`):**  
  - **LỖI CHÍNH:** Ảnh hero `dudu-hero.png` bị ép chiều cao cố định **1024px** trên toàn bộ 5 viewport do thiếu `height: auto`!
  - Cắt cúp sai lệch: Tại desktop 1440px, ly Matcha phía bên phải bị crop mất 80% chiều rộng. Tại tablet 768px, ảnh cao ngất ngưởng làm khuấy đảo cấu trúc trang.
  - Sticker "3 vị đúng gu" xoay 8deg nằm đè lên góc phải trên của ảnh, che mất phần ống hút và nắp ly dâu trên một số kích thước màn hình.
- **Tác động đến người dùng:** Ấn tượng đầu tiên về sản phẩm bị hỏng; khách hàng không nhìn thấy trọn vẹn 3 ly nước đặc sắc nhất của quán.
- **Selector/Component liên quan:** `.hero`, `.hero-visual`, `.hero-visual img`, `.hero-sticker`, `.hero-caption`.
- **Cách cải thiện cụ thể:**  
  1. Khai báo ngay lập tức:
     ```css
     .hero-visual img {
       width: 100%;
       height: auto; /* Bắt buộc để aspect-ratio có hiệu lực */
       aspect-ratio: 16 / 10; /* Tỷ lệ vàng hiển thị trọn vẹn 3 ly */
       object-fit: cover;
       object-position: center center;
       border-radius: 32px;
     }
     ```
  2. Trên mobile (≤ 640px): Tinh chỉnh `aspect-ratio: 4 / 3` với `object-position: 65% center` để ly đường đen, dâu và matcha cùng xuất hiện hài hòa trong khung nhìn.
  3. Sticker "3 vị đúng gu": Đặt vị trí bám sát góc ngoài, giảm kích thước từ 104px xuống 76px trên mobile, để không che mất nắp ly nước.
  4. Caption "Best trio": Nâng cao độ tương phản chữ, tạo điểm nhấn editorial sắc nét.
- **Cách kiểm chứng:** Mở trên cả 5 viewport: cả 3 ly trà sữa (Đường đen, Dâu, Matcha) đều nhìn thấy rõ ràng từ nắp, thân ly, màu nước cho đến lớp trân châu dưới đáy.

---

### 9. Menu Discovery UX (Trải Nghiệm Khám Phá Menu)

- **Vấn đề hiện tại (Quan sát thực tế trên browser `desktop-1440-menu.png`):**  
  - Bộ lọc chỉ gồm 3 nút tĩnh: "Tất cả", "Trà sữa", "Trà trái cây". Không hỗ trợ tìm kiếm hay phân loại theo "mood" như lời hứa ở Hero ("Một ly theo mood").
  - Khi click chuyển bộ lọc, các thẻ món biến mất và xuất hiện đột ngột không hề có chuyển cảnh mượt mà (transition).
  - Dòng chữ "Sáu món dễ mê, hai nhóm vị..." nằm lệch về bên phải, tạo khoảng trống lớn vô lý trên màn hình lớn.
- **Tác động đến người dùng:** Trải nghiệm duyệt món bị đơn điệu, giống như xem một danh sách cứng hơn là khám phá đồ uống theo sở thích.
- **Selector/Component liên quan:** `.menu-toolbar`, `.filter-chip`, `.menu-grid`.
- **Cách cải thiện cụ thể:**  
  1. *Mood Pills:* Thêm các tag cảm xúc trực quan trên chip lọc: ✦ Tất cả, 🧋 Trà sữa đậm vị, 🍓 Trà trái cây tươi mát, ✨ Ít ngọt thanh lành.
  2. *Filter Animation:* Áp dụng animation nhẹ cho `.menu-card` khi render lại:
     ```css
     @keyframes cardFadeIn {
       from { opacity: 0; transform: translateY(12px) scale(0.98); }
       to { opacity: 1; transform: translateY(0) scale(1); }
     }
     .menu-card { animation: cardFadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) backwards; }
     ```
  3. Đưa thông điệp "Giá minh hoạ" thành một badge nhỏ tinh tế có icon thông tin bên cạnh thanh lọc, minh bạch và lịch sự.
- **Cách kiểm chứng:** Chuyển đổi qua lại giữa các tab bộ lọc: giao diện phản hồi êm ái, thẻ món trượt nhẹ nhàng vào vị trí trong vòng 300ms.

---

### 10. Menu Card Anatomy (Giải Phẫu Thẻ Món Ăn)

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `desktop-1440-menu.png`):**  
  - **Lỗi thiết kế minh hoạ (Visual Inconsistency):** Cả 6 ly đồ uống đều dùng chung một bộ khung CSS cup (`.drink-cup`) với trân châu đen dưới đáy (`.pearls`). Món "Trà Đào Cam Sả" và "Chanh Dây Nha Đam" là trà trái cây thanh mát nhưng lại vẽ trân châu đen đặc quánh dưới đáy!
  - Tiêu đề món: "Sữa Tươi Trân Châu Đường Đen" bị rớt chữ "Đen" xuống dòng 2 một mình trên desktop 1440px.
  - Nút thêm món (`.add-button`): Chỉ là một nút tròn màu đen có dấu cộng. Khi hover chỉ xoay nhẹ 8 độ, chưa thể hiện rõ hành động "đã thêm thành công".
- **Tác động đến người dùng:** Minh hoạ đồ uống sai lệch thực tế khiến khách hàng bối rối; không tạo được cảm giác ngon miệng đặc trưng của từng dòng trà.
- **Selector/Component liên quan:** `.menu-card`, `.drink-art`, `.drink-cup`, `.pearls`, `.menu-card h3`, `.add-button`.
- **Cách cải thiện cụ thể:**  
  1. *Phân hóa Visual Cup:*
     - Nhóm Trà sữa (`category: "milk-tea"`): Giữ nguyên trân châu tròn ấm áp hoặc lớp mochi dẻo.
     - Nhóm Trà trái cây (`category: "fruit-tea"`): Thay thế `.pearls` bằng các lát thạch/trái cây lập thể trong suốt (nha đam khối ngọc hoặc lát cam sả nổi).
  2. *Xử lý Typography Thẻ:* Áp dụng `text-wrap: balance` cho `.menu-card h3` để loại bỏ hoàn toàn hiện tượng từ mồ côi rớt dòng.
  3. *Micro-interaction cho Nút Thêm:* Khi click, nút dấu cộng biến đổi mượt thành dấu tích xanh lime (`✓`) trong 600ms kèm hiệu ứng lan tỏa (ripple) trước khi quay lại trạng thái cũ.
- **Cách kiểm chứng:** Kiểm tra trực quan cả 6 thẻ: Trà trái cây không còn trân châu đen; tên món phân bổ đều đặn không rớt chữ cụt.

---

### 11. Cart Drawer UX (Trải Nghiệm Giỏ Hàng Trượt)

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `mobile-320-cart-items.png`):**  
  - **LỖI UX BLOCKER TRÊN MOBILE:** Toast "Đã thêm một ly vào giỏ" nằm ở đáy màn hình với `z-index: 110`, **chắn thẳng vào nút "Sao chép đơn hàng"**! Khi người dùng mở giỏ để copy đơn, họ bị chặn không thể bấm nút trong 1.8 giây!
  - Khi giỏ hàng rỗng, giao diện chỉ có dòng chữ buồn tẻ và nụ cười màu hồng trượt chuẩn tương phản.
  - Khi copy đơn thành công, dòng text thông báo nhỏ xíu màu mận (`#5a1236`) xuất hiện dưới nút bấm mà không có hiệu ứng chúc mừng hay phản hồi rõ ràng.
- **Tác động đến người dùng:** Người dùng bị ức chế vì không bấm được nút; thao tác copy đơn thiếu sự chắc chắn và niềm vui.
- **Selector/Component liên quan:** `.cart-drawer`, `#toast`, `#copy-order`, `#copy-status`, `.cart-empty`.
- **Cách cải thiện cụ thể:**  
  1. *Khắc phục lỗi Toast đè nút:*
     - Khi mở Cart Drawer (`body.drawer-open`), tự động ẩn Toast (`#toast { display: none !important; }`), hoặc chuyển vị trí Toast lên góc trên màn hình (`top: 24px; bottom: auto;`).
  2. *Nâng cấp Nút Sao Chép Đơn:*
     - Khi bấm sao chép, nút `#copy-order` đổi màu từ Plum sang Lime (`#c9f36d`), chữ đổi sang Ink (`#2c101e`), nội dung: "✓ Đã sao chép đơn DuDu!".
     - Hiển thị một khung "Xem trước đơn hàng" (Receipt Preview) dạng vé xem phim xinh xắn, thể hiện sự chỉn chu của Gen Z.
  3. *Empty State:* Thêm nút CTA phụ "Xem menu ngay" trong phần giỏ rỗng để người dùng bấm là tự động đóng drawer và cuộn tới menu.
- **Cách kiểm chứng:** Thêm món vào giỏ, bấm mở giỏ ngay lập tức trên mobile 320px: nút "Sao chép đơn hàng" hoàn toàn tự do, không hề bị che khuất; bấm copy nhận ngay phản hồi visual nổi bật.

---

### 12. Trạng Thái Giao Diện (Empty, Hover, Focus, Active, Loading)

- **Vấn đề hiện tại (Đo kiểm thực tế trên browser):**  
  - Hover trên Header Cart Button thiếu transition mượt (đã ghi nhận trong QA-003).
  - Focus-visible viền hồng `#f06a8a` không đạt chuẩn tương phản 3:1 trên nền sáng.
  - Skip link (`.skip-link`) xuất hiện vô cớ và bị đè lên tiêu đề khi phần tử được focus tự động trong một số ngữ cảnh trình duyệt.
  - Không có skeleton loading khi tải trang hoặc khi đổi món.
- **Tác động đến người dùng:** Cảm giác tương tác còn hơi "thô", thiếu sự tinh tế của một sản phẩm cao cấp.
- **Selector/Component liên quan:** `:focus-visible`, `.skip-link`, `.cart-button:hover`, `.filter-chip:hover`.
- **Cách cải thiện cụ thể:**  
  1. *Focus State:* Đổi toàn bộ viền focus sang màu `--pink-ink: #bd2854` với độ dày 3px và khoảng đệm 3px, đạt tương phản 5.6:1 trên mọi nền sáng.
  2. *Skip-link:* Đổi sang trạng thái hiển thị chuẩn:
     ```css
     .skip-link {
       position: fixed;
       top: -100px;
       left: 16px;
       z-index: 999;
       transition: top 0.2s ease-in-out;
     }
     .skip-link:focus-visible {
       top: 16px;
       outline: 3px solid var(--plum-deep);
     }
     ```
  3. *Card Hover:* Sử dụng bóng đổ đa tầng mịn màng (layered box-shadow):
     ```css
     .menu-card:hover {
       transform: translateY(-8px) scale(1.01);
       box-shadow: 0 20px 48px -12px rgba(90, 18, 54, 0.16), 0 8px 16px -8px rgba(90, 18, 54, 0.08);
     }
     ```
- **Cách kiểm chứng:** Dùng phím Tab duyệt qua toàn bộ trang: viền focus rõ ràng, tương phản sắc nét, skip link chỉ xuất hiện khi ấn Tab.

---

### 13. Motion và Reduced-Motion (Chuyển Động & Tiếp Cận)

- **Vấn đề hiện tại (Kiểm tra qua cờ `reducedMotion` của Edge):**  
  - Ticker marquee hiện tại chạy ở tốc độ 38s, tuy nhiên trên màn hình lớn 1440px thì hơi chậm, còn trên mobile lại trôi quá nhanh đối với một số người đọc chậm.
  - Khi kích hoạt `prefers-reduced-motion: reduce`, code CSS dùng `animation-duration: .01ms !important; transition-duration: .01ms !important;` khiến giỏ hàng mở đóng bị giật phụt (snap) đột ngột không báo trước.
- **Tác động đến người dùng:** Người dùng nhạy cảm tiền đình hoặc cần tiếp cận đặc biệt bị giật mình khi giỏ hàng nhảy ra tức thì.
- **Selector/Component liên quan:** `.ticker-track`, `@media (prefers-reduced-motion: reduce)`, `.cart-drawer`.
- **Cách cải thiện cụ thể:**  
  1. Ticker: Tinh chỉnh tốc độ theo viewport (`45s` trên mobile, `32s` trên desktop). Khi rê chuột (hover) vào ticker, tự động tạm dừng (`animation-play-state: paused;`) để người dùng dễ đọc chữ.
  2. Reduced Motion Nhân Văn: Thay vì triệt tiêu hoàn toàn transition làm giật layout, thay thế chuyển động trượt ngang (slide-in) bằng chuyển động mờ dần (opacity fade 0.15s) êm dịu, không gây chóng mặt:
     ```css
     @media (prefers-reduced-motion: reduce) {
       .cart-drawer {
         transform: none !important;
         transition: opacity 0.15s ease-in-out, visibility 0.15s !important;
         opacity: 0;
       }
       body.drawer-open .cart-drawer {
         opacity: 1;
       }
     }
     ```
- **Cách kiểm chứng:** Bật chế độ Reduce Motion trong Windows Settings: Marquee dừng hẳn và dàn hàng ngay ngắn; Giỏ hàng mở ra dạng fade mờ êm ái, không có chuyển động trượt ngang.

---

### 14. Mobile Experience tại 320px và 390px

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `mobile-320-full.png` và `mobile-390-full.png`):**  
  - Tại 320px:
    + Tiêu đề Hero rớt thành 3 dòng, "ngụm" và "đầu." bị đứt quãng.
    + Ảnh Hero cao 1024px làm người dùng phải vuốt 2 màn hình mới thấy được nút bấm.
    + Thẻ Story h2 có 5 dòng, rớt từ "kỳ." mồ côi.
    + Header Nav thiếu padding chạm.
  - Tại 390px:
    + Cải thiện hơn về độ rộng nhưng ảnh Hero vẫn cao 1024px bất hợp lý.
- **Tác động đến người dùng:** Trải nghiệm trên điện thoại thông minh (chiếm 85% lưu lượng Gen Z) bị giảm sút nghiêm trọng.
- **Selector/Component liên quan:** Toàn bộ media query `@media (max-width: 640px)`.
- **Cách cải thiện cụ thể:**  
  1. Đặt kích thước tiêu đề Hero tại 320px là `clamp(2.4rem, 11vw, 3.2rem)`, đảm bảo cụm "ngụm đầu." luôn nằm trọn vẹn trên 1 dòng duy nhất.
  2. Khống chế chiều cao ảnh Hero tối đa không vượt quá 60vh (`max-height: 380px; height: auto; object-fit: cover;`).
  3. Story card heading: hạ clamp floor xuống `1.85rem` để tiêu đề "Một ly vui, không cần cầu kỳ." chỉ gói gọn trong 2-3 dòng thanh lịch.
- **Cách kiểm chứng:** Đo kích thước thực tế trên iPhone SE (320px) và iPhone 14 (390px): không có chữ rớt mồ côi, toàn bộ phần Hero hiển thị vừa vặn trong màn hình đầu tiên (above the fold).

---

### 15. Tablet Experience tại 768px

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `tablet-768-hero.png` & `tablet-768-menu.png`):**  
  - Tại 768px (iPad dọc): Hero chuyển thành 1 cột nhưng lại giữ ảnh rộng 606px và cao 1024px! Khối Hero chiếm tới gần 1800px chiều dọc, tạo ra một "hố sâu nội dung" (content pit).
  - Lưới Menu 2 cột (355px mỗi cột) hoạt động khá tốt, nhưng khoảng cách giữa 2 cột (`gap: 18px`) hơi hẹp so với không gian thoáng đãng của máy tính bảng.
- **Tác động đến người dùng:** Người dùng máy tính bảng cảm thấy trang web bị kéo dài lê thê, mất kiên nhẫn khi phải cuộn liên tục.
- **Selector/Component liên quan:** `@media (max-width: 980px)`.
- **Cách cải thiện cụ thể:**  
  1. Tại khoảng 641px – 980px: Duy trì bố cục Hero dạng **2 cột ngang** (Side-by-side) thay vì dồn thành 1 cột dọc: Cột trái 50%, cột phải 50% với ảnh hero `aspect-ratio: 1 / 1`.
  2. Tăng khoảng cách lưới Menu `gap: 24px` để tăng khoảng thở cho mắt.
- **Cách kiểm chứng:** Kiểm tra trên màn hình iPad 768 × 1024: người dùng thấy ngay cả thông điệp Hero lẫn một phần của Ticker/Menu ngay trong màn hình đầu tiên.

---

### 16. Desktop Experience tại 1440px

- **Vấn đề hiện tại (Bằng chứng chụp thực tế `desktop-1440-hero.png` & `desktop-1440-menu.png`):**  
  - Hero visual: Ảnh cao 1024px làm biến dạng khung hình, cắt mất ly Matcha bên phải.
  - Lưới Menu 3 cột rộng 1180px: các thẻ menu có chiều cao 437px khá đẹp, nhưng phần hình minh hoạ ly nước bên trong còn đơn điệu, chưa tương xứng với độ hoành tráng của màn hình Retina lớn.
  - Chân trang (Footer): Chiều cao 140px, bố cục trải dài đơn giản, thiếu các yếu tố nhận diện vui nhộn của thương hiệu (như sticker, lời chào tạm biệt dễ thương).
- **Tác động đến người dùng:** Trải nghiệm trên desktop chưa đạt độ "sang xịn" (premium editorial) xứng tầm thương hiệu.
- **Selector/Component liên quan:** `.hero`, `.menu-card`, `footer`.
- **Cách cải thiện cụ thể:**  
  1. Hero 1440px: Thiết lập `aspect-ratio: 16 / 10` cho ảnh, hiển thị trọn vẹn cả 3 ly với độ chi tiết cao, khói đá mát lạnh, ánh sáng óng ả trên nền plum sâu.
  2. Bổ sung hiệu ứng parallax nhẹ khi cuộn chuột cho hình sticker và caption.
  3. Thẻ menu: Cung cấp visual phong phú hơn cho từng món.
  4. Footer: Thêm micro-copy ấm áp "Pha bằng cả trái tim tại Sài Gòn" kèm biểu tượng ly trà DuDu xoay nhẹ.
- **Cách kiểm chứng:** Trải nghiệm trên màn hình 1440 × 900: bố cục cân đối hoàn hảo, hình ảnh sắc sảo, không hề có vùng trống thừa hoặc vùng chen chúc.

---

### 17. Những Phần Nên Giữ (Core Strengths to Preserve)

1. **Bảng màu nhận diện thương hiệu độc đáo:** Sự kết hợp giữa Deep Plum (`#35071f`), Warm Cream (`#fff5df`), Fresh Lime (`#c9f36d`), và Sweet Pink (`#f06a8a`) là một phối màu xuất sắc, phá vỡ khuôn mẫu màu xanh lá/nâu sữa thông thường của thị trường trà sữa.
2. **Cặp Typography cá tính:** Fraunces (serif hiện đại với nét đục đẽo vintage) và Be Vietnam Pro (sans-serif tối ưu cho tiếng Việt) tạo nên một phong cách editorial rất riêng biệt và cuốn hút.
3. **Nền tảng kỹ thuật Buildless thuần khiết:** Kiến trúc HTML/CSS/JS thuần không qua đóng gói (buildless) giúp trang tải tức thì, dung lượng siêu nhẹ, thân thiện với SEO và cực kỳ dễ bảo trì.
4. **Cam kết Trung thực Thương hiệu (Brand Honesty):** Tính năng giỏ hàng demo local có copy đơn kèm thông báo minh bạch, không bịa đặt số liệu đơn ảo, không làm giả testimonial.
5. **Cơ chế Accessibility tiên tiến đã có:** Việc áp dụng thuộc tính `inert` cho các landmark ngầm khi mở giỏ hàng, thẻ `<aside>` có `role="dialog" aria-modal="true"`, và hỗ trợ phím Escape chuẩn mực cần được giữ vững 100%.

---

### 18. Những Phần Cần Thiết Kế Lại (Areas Requiring Redesign)

1. **Thành phần Hero Visual (Thiết kế lại hoàn toàn cơ chế kích thước):**
   - Loại bỏ sự phụ thuộc vào thuộc tính HTML `height="1024"`.
   - Thiết lập hệ thống `aspect-ratio` đáp ứng thực sự: 16:10 trên desktop, 1:1 trên tablet, 4:3 trên mobile.
   - Định vị lại sticker và caption để giải phóng góc nhìn cho ly Matcha và Đường Đen.
2. **Luồng Toast & Cart Drawer (Thiết kế lại hệ thống thông báo):**
   - Tách biệt không gian hiển thị của Toast khỏi không gian của Drawer để dứt điểm lỗi đè nút "Sao chép đơn hàng".
   - Tạo trạng thái feedback thành công trực tiếp ngay trên nút bấm.
3. **Artwork Minh hoạ cho Thẻ Món (Thiết kế lại hệ thống ly):**
   - Tách biệt thành 2 biến thể ly rõ rệt: Ly Trà Sữa (sữa béo + trân châu đen/mochi) và Ly Trà Trái Cây (trà trong vắt + thạch/trái cây mát lạnh).
4. **Thanh Điều Hướng Mobile (Thiết kế lại Mobile Navigation):**
   - Biến 3 liên kết dạng text trần thành thanh pill trượt có touch target chuẩn ≥ 44px.
5. **Thang Đo Type Scale trên Mobile (Cân chỉnh lại clamp):**
   - Hạ mức chặn dưới (floor clamp) của tiêu đề Story h2 và Hero h1 để chấm dứt tình trạng rớt từ mồ côi và dính dấu tiếng Việt.

---

### 19. Danh Sách Thay Đổi Theo Mức Độ Ưu Tiên

#### Nhóm 1: Bắt Buộc Phải Sửa (Must Fix — Severity: HIGH)

##### [MUST-01] Sửa lỗi chiều cao Hero Image 1024px cố định trên mọi thiết bị
- **Vấn đề hiện tại:** HTML có `height="1024"`, CSS thiếu `height: auto;`. Ảnh bị kéo dài thành 1024px trên toàn bộ viewport, phá nát bố cục mobile và tablet.
- **Tác động đến người dùng:** Người dùng mobile phải cuộn 2 màn hình để qua phần ảnh; người dùng desktop bị cắt mất 80% ly Matcha.
- **Selector/Component liên quan:** `.hero-visual img`, `img`.
- **Cách cải thiện cụ thể:** Thêm `height: auto;` vào `img` toàn cục tại dòng 36 `styles.css`, và cấu hình `aspect-ratio: 16/10` cho `.hero-visual img`.
- **Cách kiểm chứng:** Đo kích thước thực tế qua trình duyệt: chiều cao ảnh trên desktop ~370px, trên mobile ~205px.

##### [MUST-02] Dẹp bỏ xung đột Toast notification che khuất nút "Sao chép đơn hàng"
- **Vấn đề hiện tại:** Toast `#toast` có `z-index: 110` nằm ở đáy màn hình, đè trực tiếp lên nút `#copy-order` khi mở giỏ trên mobile.
- **Tác động đến người dùng:** Khách hàng không thể bấm sao chép đơn trong 1.8 giây, gây ức chế và tưởng giao diện bị đơ.
- **Selector/Component liên quan:** `#toast`, `body.drawer-open #toast`.
- **Cách cải thiện cụ thể:** Thêm rule: `body.drawer-open #toast { opacity: 0 !important; pointer-events: none !important; }` hoặc chuyển Toast lên đỉnh màn hình (`top: 24px`).
- **Cách kiểm chứng:** Thêm món và bấm mở giỏ ngay trên viewport 320px/390px: nút Sao chép đơn hàng hoàn toàn bấm được ngay lập tức.

##### [MUST-03] Khắc phục va chạm dấu tiếng Việt và rớt từ mồ côi trên tiêu đề Mobile
- **Vấn đề hiện tại:** Tại 320px, `.hero h1` bị ngắt 3 dòng; dấu nặng của "ngụm" và dấu mũ+huyền của "đầu." cách nhau 2.5px. `.story-main h2` có floor clamp 54.4px gây vỡ thành 5 dòng với từ "kỳ." đứng trơ trọi.
- **Tác động đến người dùng:** Chữ tiếng Việt bị dính nét, mất mỹ cảm, khó đọc.
- **Selector/Component liên quan:** `.hero h1`, `.story-main h2`.
- **Cách cải thiện cụ thể:** Nâng `line-height` heading lên `1.2`, hạ clamp mobile của Story h2 xuống `clamp(1.85rem, 8vw, 3rem)`.
- **Cách kiểm chứng:** Kiểm tra thị giác tại 320px: cụm "ngụm đầu." nằm cùng 1 dòng, Story h2 chỉ còn 2-3 dòng cân đối.

##### [MUST-04] Đạt chuẩn tương phản WCAG 2.2 cho Viền Focus toàn trang
- **Vấn đề hiện tại:** `:focus-visible` dùng viền hồng `#f06a8a` có độ tương phản chỉ 2.72:1 trên nền kem, trượt chuẩn WCAG 2.2 2.4.13 (yêu cầu ≥ 3.0:1).
- **Tác động đến người dùng:** Người dùng điều hướng bằng bàn phím không thấy rõ vị trí con trỏ đang ở đâu.
- **Selector/Component liên quan:** `:focus-visible`.
- **Cách cải thiện cụ thể:** Thay bằng `:focus-visible { outline: 3px solid var(--pink-ink); outline-offset: 3px; }` (đạt 5.39:1).
- **Cách kiểm chứng:** Tab qua các nút trên trang và đo tỷ lệ tương phản: đạt ≥ 5.0:1.

---

#### Nhóm 2: Nên Cải Thiện Sớm (Should Improve — Severity: MEDIUM)

##### [SHOULD-01] Nâng cấp diện tích chạm (Touch Target) cho Mobile Navigation
- **Vấn đề hiện tại:** 3 liên kết Menu trên mobile chỉ là inline text với chiều cao ~20px, dưới chuẩn tối thiểu 44px.
- **Tác động đến người dùng:** Dễ bấm trượt, bấm nhầm link khi dùng ngón tay cái trên điện thoại.
- **Selector/Component liên quan:** `.desktop-nav a`.
- **Cách cải thiện cụ thể:** Chuyển các link thành dạng pill chip có padding `9px 16px`, chiều cao tổng thể 40–44px.
- **Cách kiểm chứng:** Đo bounding rect của link trên mobile: chiều cao ≥ 40px, khoảng cách giữa các link ≥ 12px.

##### [SHOULD-02] Sửa lỗi trà trái cây vẽ kèm trân châu đen
- **Vấn đề hiện tại:** "Trà Đào Cam Sả" và "Chanh Dây Nha Đam" có lớp trân châu đen `.pearls` bên dưới ly, sai tính chất thức uống.
- **Tác động đến người dùng:** Gây cảm giác thiết kế lười biếng, thiếu am hiểu về sản phẩm trà sữa/trà trái cây Việt Nam.
- **Selector/Component liên quan:** `.menu-card[data-tone="orange"] .pearls`, `.menu-card[data-tone="berry"] .pearls`.
- **Cách cải thiện cụ thể:** Tùy biến CSS để nhóm trà trái cây hiển thị hạt nha đam trong suốt hoặc lát đào thay vì trân châu tròn đen.
- **Cách kiểm chứng:** Quan sát thẻ Đào Cam Sả và Chanh Dây trên menu: không còn xuất hiện trân châu đen.

##### [SHOULD-03] Chống kẹt Skip-link đè lên tiêu đề nội dung
- **Vấn đề hiện tại:** `.skip-link:focus` xuất hiện cả khi nhận programmatic focus trong một số trình duyệt, che mất chữ tiêu đề bên dưới.
- **Tác động đến người dùng:** Khách hàng thấy một nút xanh lime che chữ mà không hiểu tại sao.
- **Selector/Component liên quan:** `.skip-link`.
- **Cách cải thiện cụ thể:** Chỉ kích hoạt khi `:focus-visible`, đồng thời đặt `z-index: 999` với hiệu ứng trượt êm ái.
- **Cách kiểm chứng:** Click chuột vào trang không bao giờ làm hiện skip-link; chỉ khi ấn Tab từ đầu trang thì skip-link mới trượt xuống.

##### [SHOULD-04] Cải thiện bố cục Tablet 768px dạng 2 cột ngang
- **Vấn đề hiện tại:** Bố cục Hero trên tablet 768px bị ép thành 1 cột dọc quá dài.
- **Tác động đến người dùng:** Cuộn trang mỏi tay trên iPad.
- **Selector/Component liên quan:** `.hero` tại `@media (max-width: 980px)`.
- **Cách cải thiện cụ thể:** Điều chỉnh layout tablet thành 2 cột cân đối, khống chế chiều cao tổng thể của Hero dưới 600px.
- **Cách kiểm chứng:** Xem trên iPad Portrait 768px: Hero vừa vặn, Menu xuất hiện ngay trong tầm mắt.

---

#### Nhóm 3: Nâng Cao Trải Nghiệm (Nice to Have — Severity: LOW)

##### [NICE-01] Micro-interaction cho Nút Thêm Món và Nút Giỏ Hàng
- **Vấn đề hiện tại:** Thêm món chỉ xoay nhẹ nút, giỏ hàng chỉ đổi số đơn giản.
- **Tác động đến người dùng:** Thiếu cảm giác hưng phấn mua sắm (shopping dopamine) đặc trưng của Gen Z.
- **Selector/Component liên quan:** `.add-button`, `.cart-count`.
- **Cách cải thiện cụ thể:** Hiệu ứng nảy (bounce scale 1.2 -> 1.0) cho badge giỏ hàng khi tăng số lượng; ripple effect trên nút dấu cộng.
- **Cách kiểm chứng:** Bấm thêm món: số nhảy nảy nhẹ nhàng, bắt mắt.

##### [NICE-02] Khung xem trước đơn hàng (Receipt Mini-Preview) trong Giỏ hàng
- **Vấn đề hiện tại:** Dòng thông báo copy đơn chỉ là một đoạn text nhỏ.
- **Tác động đến người dùng:** Người dùng chưa hình dung được đoạn text đã copy trông như thế nào trước khi dán vào Zalo/Tin nhắn.
- **Selector/Component liên quan:** `.cart-summary`.
- **Cách cải thiện cụ thể:** Bổ sung một ô preview nhỏ định dạng vé xinh xắn thể hiện đúng nội dung sẽ copy vào clipboard.
- **Cách kiểm chứng:** Bấm sao chép đơn: nút đổi trạng thái "Đã sao chép" rõ ràng và hiển thị đoạn text mẫu.

##### [NICE-03] Tạm dừng Marquee khi hover (Pause on Hover)
- **Vấn đề hiện tại:** Dòng chữ chạy liên tục, người dùng muốn đọc kỹ một thông điệp phải di chuyển mắt theo.
- **Tác động đến người dùng:** Hơi bất tiện khi muốn đọc kỹ điểm nổi bật của quán.
- **Selector/Component liên quan:** `.ticker:hover .ticker-track`.
- **Cách cải thiện cụ thể:** Thêm `animation-play-state: paused;` khi rê chuột qua ticker.
- **Cách kiểm chứng:** Rê chuột vào ticker: chữ dừng lại; rê chuột ra ngoài: chữ tiếp tục trôi mượt mà.

---

### 20. Acceptance Criteria Có Thể Kiểm Chứng (Verifiable AC)

Mọi thay đổi tiếp theo của Codex phải vượt qua toàn bộ 10 tiêu chí nghiệm thu sau:

1. **AC-01 (Hero Framing & Sizing):**  
   Trên cả 5 viewport (320, 390, 768, 1024, 1440px), ảnh Hero không bao giờ vượt quá chiều cao container dự kiến; hiển thị đầy đủ cả 3 ly (Đường đen, Dâu, Matcha); không bị crop cụt ly Matcha bên phải trên desktop; không xuất hiện "tháp ảnh 1024px" trên mobile.
2. **AC-02 (Toast & Drawer Clearance):**  
   Khi thêm món và mở giỏ hàng tại viewport 320px và 390px, Toast thông báo không bao giờ che đè lên nút "Sao chép đơn hàng" (`#copy-order`). Khoảng cách giữa Toast và nút bấm (nếu cùng xuất hiện) tối thiểu là 16px, hoặc Toast tự ẩn khi Drawer kích hoạt.
3. **AC-03 (Vietnamese Diacritic Clearance):**  
   Tại 320px, cụm từ "ngụm đầu." trong tiêu đề Hero phải nằm trọn vẹn trên 1 dòng; khoảng cách giữa descender chữ trên và dấu thanh chữ dưới tối thiểu là 5px; tiêu đề Story h2 không ngắt quá 3 dòng và không để từ "kỳ." mồ côi.
4. **AC-04 (WCAG Contrast & Focus Compliance):**  
   Tất cả văn bản hiển thị đạt tối thiểu WCAG AA (≥ 4.5:1 cho text nhỏ, ≥ 3.0:1 cho text lớn). Viền focus `:focus-visible` đạt độ tương phản tối thiểu ≥ 3.0:1 trên mọi nền trang. Biểu tượng nụ cười rỗng đạt ≥ 3.0:1.
5. **AC-05 (Mobile Touch Targets):**  
   Mọi phần tử có thể tương tác trên mobile (link header, nút lọc, nút thêm món, nút tăng giảm giỏ hàng) đều đạt kích thước vùng chạm tối thiểu **44 × 44 px** (bao gồm cả padding mở rộng).
6. **AC-06 (No Horizontal Overflow):**  
   Khi đo bằng script kiểm tra tự động `document.documentElement.scrollWidth === document.documentElement.clientWidth` trên cả 5 viewport với `overflow-x` tắt tạm thời, không có bất kỳ phần tử nào tràn mép màn hình.
7. **AC-07 (Drink Category Visual Accuracy):**  
   Các món thuộc nhóm Trà trái cây ("Trà Đào Cam Sả", "Chanh Dây Nha Đam") không hiển thị hạt trân châu đen của trà sữa.
8. **AC-08 (Smooth Reduced Motion):**  
   Dưới cài đặt `prefers-reduced-motion: reduce`, Marquee dừng chạy và dàn hàng tĩnh ở giữa trang; Cart Drawer đóng mở bằng hiệu ứng fade êm ái, không có chuyển động giật cục gây khó chịu.
9. **AC-09 (Brand Voice & Reality Constraint):**  
   Không phát sinh bất kỳ thông tin địa chỉ, hotline, giờ mở cửa hay review khách hàng bịa đặt nào; giữ nguyên chú thích "Giá đang là nội dung minh hoạ".
10. **AC-10 (Zero Console Errors & Zero External Dependencies Broken):**  
    Trang web vận hành hoàn hảo từ file tĩnh trong `dist/`, không có lỗi JavaScript console nào khi thêm, sửa, xóa, copy đơn hàng.

---

## Bàn Giao (Handoff)

- **Task ID:** UX-000 ("DuDu UX/UI Pro Max" Art Direction Review)
- **Files changed:** `docs/reviews/antigravity-art-direction.md` (Tạo mới toàn bộ báo cáo chi tiết). Tuyệt đối **không chạm vào bất kỳ file nào trong `dist/`**.
- **Checks run and results:**
  - Khởi chạy script tự động hóa trình duyệt Edge (Chromium) qua Playwright trên máy chủ đang chạy thật tại `http://127.0.0.1:4173/`.
  - Kiểm tra, đo đạc thông số layout, bounding rect, computed styles, và chụp ảnh bằng chứng trên **5 viewport**: 320×568, 390×844, 768×1024, 1024×768, và 1440×900.
  - Kiểm tra trạng thái tương tác giỏ hàng (thêm 2 món, tăng giảm số lượng, mở/đóng drawer, copy đơn hàng).
  - Kiểm tra trạng thái tiếp cận bàn phím (Tab focus, skip-link, Escape key).
  - Kiểm tra chế độ `prefers-reduced-motion: reduce`.
  - Tính toán độc lập bảng tỷ lệ tương phản WCAG 2.1/2.2 bằng thuật toán relative luminance chuẩn hóa.
  - Kết quả: Xác thực 3 lỗi nghiêm trọng nhất (Hero height 1024px bug, Toast đè nút Copy trong Cart, Dấu tiếng Việt & font clamp trên 320px) cùng các vi phạm WCAG về focus ring.
- **Remaining risks or decisions:**
  - `BIZ-001` & `BIZ-002`: Chờ chủ thương hiệu (Human owner) xác nhận giá menu chính thức, địa chỉ thực tế tại TP.HCM và kênh nhận đơn chính thức trước khi ra mắt công chúng.
  - Quyết định việc tự host 2 font Google Fonts (`Fraunces` và `Be Vietnam Pro`) nội bộ trong `dist/assets/fonts/` để loại bỏ hoàn toàn request ra ngoài nếu muốn đạt chuẩn buildless offline 100%.
- **Recommended next owner:** **Codex (Implementation Owner)** để tiến hành hiện thực hóa các hạng mục trong danh sách **Must fix** (MUST-01 đến MUST-04) và **Should improve** (SHOULD-01 đến SHOULD-03) trong `dist/styles.css` và `dist/app.js` theo đúng đặc tả trên.
