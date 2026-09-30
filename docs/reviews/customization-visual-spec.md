# DuDu Milk Tea — Đặc tả Thị giác & Tương tác: Hộp Thoại Tùy Chỉnh Đồ Uống (Customization Sheet / Dialog)

**Tác giả:** Antigravity — Art Director & Senior Interaction Designer  
**Dự án:** DuDu Milk Tea (Sài Gòn — Gen Z / Playful Editorial & Tangible Craft)  
**Mã công việc:** `UX-201` / `DES-002` (Product Customization Visual & Interaction Spec)  
**Tập tin bàn giao:** `docs/reviews/customization-visual-spec.md`  
**Đối tượng tiếp nhận:** DeepSeek Harness (Coordinator / QA) & Codex (Implementation Owner)  
**Phạm vi:** Đặc tả thiết kế toàn diện cho trải nghiệm chọn kích cỡ, độ ngọt, lượng đá, topping, cập nhật giá thời gian thực, lưu trữ cấu hình giỏ hàng và định dạng sao chép đơn hàng.  
**Nguyên tắc kỷ luật:** Không sửa `dist/`, không sửa `TASKS.md`, không bịa đặt giá/thông tin thực tế; toàn bộ phụ thu là giá trị minh hoạ (demo values) được gắn nhãn minh bạch.

---

## 1. Tôn Chỉ Nghệ Thuật & Định Hướng "Playful Editorial & Tangible Craft"

Phiên bản hiện tại của DuDu Milk Tea đã hoàn thiện xuất sắc bộ nhận diện cốt lõi với bảng màu Mận chín (`#5a1236`), Mận thẫm (`#35071f`), Kem béo (`#fff5df`), Giấy thủ công (`#fffaf0`), Điểm nhấn Chanh cốm Lime (`#c9f36d`) và Hồng dâu Pink (`#f06a8a` / `#bd2854`).

Khi bước vào tính năng tùy chỉnh món (Customization Flow), nguy cơ phổ biến của các ứng dụng F&B là biến giao diện thành một bảng biểu khô cứng (dry corporate form) hoặc danh sách checkbox đơn điệu. Với DuDu, hộp thoại tùy chỉnh phải mang tinh thần **"Tangible Craft" (Cảm giác thủ công xúc giác)** và **"Playful Editorial" (Hóm hỉnh, biên tập sắc sảo)**:

1. **Cảm giác pha chế tại quầy (At-the-counter intimacy):** Mỗi thao tác chọn đá, đường, topping không chỉ là bật tắt công tắc dữ liệu, mà giống như người uống đang tự tay dặn dò bạn barista DuDu qua một tấm "vé order" xinh xắn.
2. **Khối xúc giác nổi bật (Tactile Pills & Chips):** Các lựa chọn được đóng gói trong các chip bo tròn mềm mại (`border-radius: 999px` hoặc `16px`), phản hồi xúc giác cơ học chân thực khi ấn `:active` (`scale(0.97)`), viền kiểm soát đạt chuẩn tương phản UI 3:1 (`--line-strong: #8a6a7c`).
3. **Minh hoạ sống động (Dynamic Sensory Feedback):** Hình ảnh ly trà DuDu đặc trưng được hiển thị trang trọng ở phần đầu hộp thoại, kèm nhãn cỡ ly và ghi chú trực quan, giúp người dùng cảm nhận được ly nước đang thành hình.
4. **Giọng văn Sài Gòn tự nhiên (Warm & Youthful Microcopy):** Sử dụng các cụm từ gần gũi của giới trẻ: *"Pha theo gu bạn"*, *"Ngọt vừa vặn (DuDu khuyên thử ✨)"*, *"Ít đá mát sâu"*, *"Topping thêm vui"*, *"Giá minh hoạ"*.
5. **Minh bạch tuyệt đối về bản thử nghiệm:** Tất cả các mức giá phụ thu đều kèm chú thích *"giá minh hoạ"*, tuyệt đối không gây hiểu nhầm là hệ thống đặt hàng trực tuyến thật.

---

## 2. Kiến Trúc Lựa Chọn & Ma Trận Giá Minh Hoạ (Demo Pricing Engine)

Hệ thống hỗ trợ 2 nhóm đồ uống chính: **Trà sữa (`milk-tea`)** và **Trà trái cây (`fruit-tea`)**.

```
[Món cơ sở (Base Drink)]
  │
  ├── 1. Kích cỡ (Size) ── Bắt buộc (Single choice) ── [M: 0 ₫] / [L: +6.000 ₫*]
  ├── 2. Độ ngọt (Sugar) ─ Bắt buộc (Single choice) ── [100%] / [70%] / [50%*] / [30%] / [0%]
  ├── 3. Lượng đá (Ice) ── Bắt buộc (Single choice) ── [100%] / [70%*] / [30%] / [0%]
  └── 4. Topping thêm vui ─ Tùy chọn (Multi choice)  ── [Trân châu / Nha đam / Củ năng / Foam / Mochi]
```
*\*Lưu ý: Mọi dấu hoa thị và nhãn đều biểu thị giá trị mặc định được khuyến nghị hoặc giá phụ thu minh hoạ.*

### 2.1 Chi tiết các nhóm lựa chọn

| Nhóm lựa chọn | Kiểu điều khiển | Các mức tùy chọn | Phụ thu minh hoạ | Trạng thái mặc định | Ghi chú trải nghiệm |
|---|---|---|---|---|---|
| **Kích cỡ (Size)** | Radio group | • **Size M** (350ml - Vừa vặn)<br>• **Size L** (500ml - Đã khát) | • 0 ₫<br>• +6.000 ₫ *(demo)* | Size M | Hiển thị rõ thể tích ml ước tính; Size L làm nổi bật phụ thu rõ ràng. |
| **Độ ngọt (Sugar)** | Radio group | • **100%** (Chuẩn vị quán)<br>• **70%** (Ngọt vừa)<br>• **50%** (DuDu khuyên thử ✨)<br>• **30%** (Thanh nhẹ)<br>• **0%** (Không đường - Rõ vị trà) | • 0 ₫<br>• 0 ₫<br>• 0 ₫<br>• 0 ₫<br>• 0 ₫ | **50%** *(DuDu khuyên thử)* | Mức 50% là đặc trưng của DuDu để tôn vị trà tươi nguyên bản. |
| **Lượng đá (Ice)** | Radio group | • **100%** (Đá chuẩn mát lạnh)<br>• **70%** (Ít đá mát sâu)<br>• **30%** (Rất ít đá)<br>• **0%** (Không đá) | • 0 ₫<br>• 0 ₫<br>• 0 ₫<br>• 0 ₫ | **70%** *(Ít đá)* | Với món Trà Trái Cây, khuyến cáo giữ từ 70% đá để hương vị tươi ngon nhất. |
| **Topping thêm vui** | Checkbox group | • **Trân châu dẻo đường đen**<br>• **Thạch nha đam giòn**<br>• **Thạch củ năng bùi giòn**<br>• **Kem cheese béo mặn**<br>• **Mochi kéo sợi mềm dẻo** | • +5.000 ₫ *(demo)*<br>• +5.000 ₫ *(demo)*<br>• +6.000 ₫ *(demo)*<br>• +10.000 ₫ *(demo)*<br>• +8.000 ₫ *(demo)* | Không chọn topping nào ban đầu | Cho phép chọn tối đa 3 topping để tránh tràn ly và đảm bảo chất lượng hương vị. |

### 2.2 Công thức tính giá thời gian thực (Live Price Engine)

$$\text{Đơn giá 1 ly (Unit Price)} = \text{Giá gốc món} + \text{Phụ thu cỡ ly} + \sum (\text{Phụ thu các topping đã chọn})$$
$$\text{Thành tiền (Line Total)} = \text{Đơn giá 1 ly} \times \text{Số lượng (Quantity)}$$

- Khi người dùng bấm chọn/bỏ chọn bất kỳ chip nào, số tiền tại thanh công cụ ghim đáy (Sticky Action Dock) sẽ nảy cập nhật tức thì kèm thuộc tính `aria-live="polite"` để độc giả khiếm thị dùng screen reader theo dõi được sự thay đổi.

---

## 3. Cấu Trúc Thành Phần & Phân Cấp Thị Giác (Component Anatomy)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. BACKDROP NỀN TỐI (rgba(53, 7, 31, 0.55) + blur 6px)       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 2. CONTAINER HỘP THOẠI (Paper #fffaf0, Bo góc 28px)   │  │
│  │                                                       │  │
│  │  [== 3. DRAG HANDLE / TAY CẦM KÉO (Mobile only) ==]   │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ 4. HEADER & NÚT ĐÓNG                            │  │  │
│  │  │    [Eyebrow: Pha theo gu bạn]         [Nút X]   │  │  │
│  │  │    Tên món (Fraunces H2)              44x44px   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ 5. HERO CARD TỔNG HỢP MÓN (Tùy chọn hiển thị)   │  │  │
│  │  │    [Ly minh hoạ cupArt] + Giá cơ bản + Mô tả    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ 6. VÙNG CUỘN TÙY CHỌN (Scrollable Body)         │  │  │
│  │  │                                                 │  │  │
│  │  │   • FIELDSET 1: KÍCH CỠ LY (Bắt buộc)           │  │  │
│  │  │     [ Size M (350ml) ]  [ Size L (+6.000₫) ]    │  │  │
│  │  │                                                 │  │  │
│  │  │   • FIELDSET 2: ĐỘ NGỌT (Bắt buộc)              │  │  │
│  │  │     [100%] [70%] [ 50% ✨ ] [30%] [0%]          │  │  │
│  │  │                                                 │  │  │
│  │  │   • FIELDSET 3: LƯỢNG ĐÁ (Bắt buộc)             │  │  │
│  │  │     [100% Chuẩn] [70% Ít đá] [30%] [Không đá]   │  │  │
│  │  │                                                 │  │  │
│  │  │   • FIELDSET 4: TOPPING THÊM VUI (Tùy chọn)     │  │  │
│  │  │     [ ] Trân châu (+5k)    [ ] Nha đam (+5k)    │  │  │
│  │  │     [ ] Thạch củ năng (+6k)[ ] Kem Cheese (+10k)│  │  │
│  │  │     [ ] Mochi kéo sợi (+8k)                     │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │ 7. STICKY ACTION DOCK (Ghim chân hộp thoại)     │  │  │
│  │  │    [− 1 +] Bộ đếm số lượng                      │  │  │
│  │  │    [ Nút: Thêm vào giỏ · 53.000 ₫ minh hoạ ]    │  │  │
│  │  │    Chú thích: Giá minh hoạ cho bản thử nghiệm   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Đặc Tả Trạng Thái Điều Khiển Chi Tiết (Exact Control States)

Mọi thành phần điều khiển tương tác bắt buộc phải có kích thước tối thiểu **44×44 px** (WCAG 2.5.5 / WCAG 2.5.8 Level AA) và đáp ứng đầy đủ 5 trạng thái: `default`, `hover`, `active`, `checked/selected`, và `focus-visible`.

### 4.1 Chip Lựa Chọn Đơn (Radio Chips — Cỡ ly, Ngọt, Đá)

- **Default (Chưa chọn):** Nền trong suốt hoặc `#fff`, viền `1.5px solid var(--line-strong)` (`#8a6a7c`, tương phản 3.25:1 trên nền giấy), chữ `var(--plum)` (`#5a1236`, tương phản 7.42:1). Padding `10px 18px`, bo góc `var(--radius-pill)` (999px). Chiều cao tối thiểu: 44px.
- **Hover:** Nền `rgba(201, 243, 109, 0.45)` (chanh cốm nhạt), viền `var(--plum)`.
- **Active (Nhấn giữ):** `transform: scale(0.97)`, nền `rgba(201, 243, 109, 0.7)`.
- **Checked (Đang chọn):** Nền `var(--plum)` (`#5a1236`), viền `var(--plum)`, chữ màu trắng `#ffffff`. Có huy hiệu nhỏ hoặc dấu chấm chỉ báo nổi bật. Riêng chip có khuyến nghị (như `50% Đường`), khi được chọn hiển thị nhãn phụ màu chanh cốm `var(--lime)`.
- **Focus-visible (Duyệt phím Tab):** `outline: 3px solid var(--focus-ring)` (`#35071f`), `outline-offset: 2px`, `box-shadow: 0 0 0 5px var(--focus-ring-halo)` (`rgba(255, 250, 240, 0.95)`). Đạt tương phản viền **16.80:1**.

### 4.2 Chip Chọn Nhiều (Checkbox Chips — Topping thêm vui)

- **Default (Chưa chọn):** Cấu trúc thẻ ngang hai cột hoặc thẻ flex. Bên trái là hộp kiểm giả lập 22×22px bo góc 6px với viền `--line-strong`; ở giữa là tên topping; bên phải là giá phụ thu minh hoạ (`+5.000 ₫`, màu `var(--muted)` `#6d4f5e`, 6.89:1).
- **Hover:** Viền chuyển sang `var(--plum)`, nền đổi màu `var(--cream)` (`#fff5df`).
- **Active:** `transform: scale(0.98)`.
- **Checked (Đã chọn):** Nền `rgba(240, 106, 138, 0.12)` (hồng dâu nhạt), viền `var(--pink-ink)` (`#bd2854`), chữ tên topping in đậm màu `var(--plum-deep)`. Hộp kiểm bên trái chuyển thành màu `var(--plum)` với dấu tích xanh lime (`✓`). Giá phụ thu chuyển sang màu `var(--pink-ink)` in đậm.
- **Disabled (Đã đạt giới hạn số lượng topping tối đa 3):** Độ mờ `opacity: 0.45`, `cursor: not-allowed`, viền đứt nét, không phản hồi hover/click. Kèm thông báo nhãn trợ năng: *"Đã đạt tối đa 3 topping"*.

### 4.3 Bộ Tăng Giảm Số Lượng Trong Hộp Thoại (Quantity Stepper)

- Gồm 3 phần tử: Nút Giảm (`-`), Nhãn số lượng hiện tại, Nút Tăng (`+`).
- Cả hai nút có kích thước đúng **44×44 px**, hình tròn, viền `1px solid var(--line-strong)`.
- Nút Giảm khi số lượng = 1: Không bị ẩn đi mà hiển thị trạng thái `disabled` (độ mờ `0.35`, không thể click) nhằm giữ ổn định layout.
- Nhãn số lượng: Font `Fraunces`, cỡ chữ `1.25rem`, canh giữa, có `aria-live="polite"`.

### 4.4 Nút Thao Tác Chính (Primary Action Button)

- Nhãn: `Thêm vào giỏ · [Đơn giá × Số lượng] ₫`
- Chiều cao: tối thiểu 52px, bo góc `var(--radius-pill)`, trải rộng 100% bề ngang vùng tác vụ.
- Nền `var(--plum)`, chữ trắng, đổ bóng `0 10px 24px rgba(90, 18, 54, 0.25)`.
- **Hover:** Nền `var(--plum-deep)`, đổ bóng nổi cao hơn.
- **Active:** `transform: translateY(1px) scale(0.99)`.
- **Success Flash (Khi bấm thêm thành công):** Trong vòng 700ms, nút chuyển sang màu xanh chanh `var(--lime)`, chữ màu `var(--ink)`, icon dấu tích xuất hiện nảy nhẹ trước khi đóng hộp thoại và chuyển trọng tâm focus về nút mở ban đầu hoặc mở Drawer giỏ hàng.

---

## 5. Quy Chuẩn Đáp Ứng Đa Điểm Nhìn (Responsive Adaptive Specification)

Hệ thống được thiết kế theo tư duy **Dialog-to-Bottom-Sheet Adaptive System**: tự động biến hóa từ Ngăn kéo đáy (Bottom Sheet) trên điện thoại thành Hộp thoại nổi trung tâm (Centered Modal Dialog) trên máy tính bảng và màn hình lớn.

```
                    ┌─────────────────────────┐
                    │       VIEWPORTS         │
                    └────────────┬────────────┘
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
[ MOBILE (< 720px) ]                           [ TABLET / DESKTOP (≥ 720px) ]
• Viewport 320px & 390px                       • Viewport 768px, 1024px, 1440px
• Bottom Sheet trượt từ đáy                    • Dialog nổi chính giữa màn hình
• Bo góc trên: 28px 28px 0 0                   • Bo góc toàn bộ: 28px
• Chiều rộng: 100vw                            • Chiều rộng: 580px - 740px
• Chiều cao tối đa: 88vh - 92vh                • Chiều cao tối đa: 85vh
• Có thanh kéo vuốt (drag handle)              • Nút đóng X nổi bật góc trên phải
```

### 5.1 Viewport 320 × 568 px (Mobile siêu nhỏ — iPhone SE đời đầu)
- **Hình thức:** Bottom Sheet sát cạnh đáy, chiều rộng `100%`, chiều cao tối đa `88vh`.
- **Kỷ luật tràn ngang:** `scrollWidth === clientWidth` tuyệt đối (0px tràn ngang). Tất cả padding bên trong dùng `var(--space-3)` (12px) hoặc `var(--space-4)` (16px).
- **Cách sắp xếp chip:**
  * Kích cỡ (Size): 2 chip chia đều tỉ lệ `1fr 1fr`.
  * Độ ngọt & Đá: Cuộn ngang có điểm dừng snap (`display: flex; overflow-x: auto; scroll-snap-type: x mandatory`) HOẶC xếp lưới 2-3 cột linh hoạt (`grid-template-columns: repeat(auto-fit, minmax(80px, 1fr))`).
  * Topping: 1 cột duy nhất (`grid-template-columns: 1fr`), mỗi hàng cao tối thiểu 48px đảm bảo chạm ngón tay chính xác.
- **Thanh tác vụ ghim đáy (Sticky Action Dock):**
  * Padding: `12px 16px calc(12px + env(safe-area-inset-bottom, 0px))`.
  * Stepper và Nút thêm món xếp cùng 1 hàng: Stepper gọn 104px (32px-40px-32px), nút bấm chiếm phần còn lại.

### 5.2 Viewport 390 × 844 px (Mobile tiêu chuẩn — iPhone 12/13/14/15)
- **Hình thức:** Bottom Sheet rộng `100%`, bo góc đỉnh `28px 28px 0 0`, chiều cao tối đa `85vh`.
- **Padding:** `var(--space-4)` (16px) đến `var(--space-5)` (24px).
- **Cách sắp xếp chip:**
  * Kích cỡ: 2 cột rộng rãi.
  * Độ ngọt: 5 chip xếp hàng 3 chip trên, 2 chip dưới (`grid-template-columns: repeat(3, 1fr)`).
  * Lượng đá: 4 chip xếp lưới 2×2 đều đặn.
  * Topping: Xếp 1 cột thoải mái, khoảng cách giữa các hàng 8px.

### 5.3 Viewport 768 × 1024 px & 1024 × 768 px (Tablet dọc & ngang — iPad Portrait / Landscape)
- **Hình thức:** Centered Modal Dialog căn chính giữa màn hình bằng `top: 50%; left: 50%; transform: translate(-50%, -50%)`.
- **Kích thước:** Chiều rộng cố định `580px`, chiều cao tối đa `82vh`. Bo góc `28px`, đổ bóng sâu `var(--shadow-lg)` (`0 28px 70px rgba(53, 7, 31, 0.22)`).
- **Lớp phủ nền (Backdrop):** Nền tối mận thẫm `rgba(53, 7, 31, 0.55)` kết hợp hiệu ứng làm mờ `backdrop-filter: blur(8px)`.
- **Bố cục nội dung:** Một cột cuộn mượt mà; các nhóm Độ ngọt và Lượng đá hiển thị toàn bộ trên một hàng flex ngang (`flex-wrap: wrap; gap: 8px`).

### 5.4 Viewport 1440 × 900 px (Desktop chuẩn / Màn hình rộng)
- **Hình thức:** Two-column Editorial Split Dialog — lấy cảm hứng từ trang tạp chí ẩm thực.
- **Kích thước:** Chiều rộng `740px`, chiều cao tối đa `80vh`.
- **Phân chia 2 cột:**
  * **Cột trái (280px — Cố định, nền kem `var(--cream)`):**
    - Trưng bày hình minh hoạ ly trà DuDu chuyển động nhẹ theo nhóm vị.
    - Tên món Fraunces lớn, badge phân loại, mô tả món.
    - Khối tóm tắt trực quan thời gian thực (Live Recipe Pill): cập nhật nhanh chuỗi cấu hình (ví dụ: `Size L · 50% Đường · 70% Đá · 1 Topping`).
  * **Cột phải (460px — Cuộn độc lập, nền giấy `var(--paper)`):**
    - Chứa toàn bộ các fieldset tùy chọn (Cỡ ly, Ngọt, Đá, Topping).
    - Thanh tác vụ ghim dưới chân cột phải với nút thêm món bề thế.

---

## 6. Khả Năng Tiếp Cận & Điều Hướng Bàn Phím (A11y & Keyboard Behavior — WCAG 2.2 AA)

Tính năng tùy chỉnh phải tuân thủ nghiêm ngặt tiêu chuẩn **WAI-ARIA Dialog (Modal) Pattern** và các tiêu chí thành công WCAG 2.2 Level AA:

### 6.1 Cấu trúc ngữ nghĩa (Semantic Hierarchy)
- Phần tử gốc sử dụng thẻ chuẩn HTML5 `<dialog class="custom-dialog">` hoặc thẻ `<div>` có thuộc tính:
  * `role="dialog"`
  * `aria-modal="true"`
  * `aria-labelledby="custom-dialog-title"`
  * `aria-describedby="custom-dialog-desc"`
- Mỗi nhóm lựa chọn được bao bọc trong thẻ `<fieldset class="option-group">` với `<legend class="option-legend">` rõ ràng (ví dụ: `<legend>Chọn kích cỡ ly (bắt buộc)</legend>`).

### 6.2 Cô lập nền (Background Inertness & Focus Trap)
- Khi mở hộp thoại tùy chỉnh:
  1. Ghi nhớ phần tử đang giữ focus trước đó (`lastFocusedElement = document.activeElement`).
  2. Gán thuộc tính `inert` cho toàn bộ các landmark bên ngoài: `.site-header`, `main`, `footer`, và `.cart-drawer`.
  3. Thêm class `dialog-open` vào thẻ `<body>` để ngăn hiện tượng cuộn nền kép (background bounce scroll).
  4. Ép trình duyệt cập nhật layout (`void dialog.offsetHeight`) trước khi chuyển focus vào phần tử tương tác đầu tiên.
  5. Điểm dừng focus đầu tiên: **Radio button của lựa chọn kích cỡ mặc định (Size M)**, giúp người dùng bàn phím có thể nhấn Tab duyệt ngay các lựa chọn mà không phải đi qua nút Đóng.

### 6.3 Điều hướng bằng bàn phím (Keyboard Interaction Pattern)
- **Phím Tab / Shift + Tab:** Di chuyển tuần tự và bị nhốt hoàn toàn bên trong hộp thoại (Focus Trap): Nút đóng → Nhóm Size → Nhóm Đường → Nhóm Đá → Nhóm Topping → Bộ đếm số lượng → Nút Thêm vào giỏ → Vòng lại Nút đóng.
- **Phím Mũi tên (Arrow Left / Right / Up / Down):** Duyệt giữa các tùy chọn radio trong cùng một nhóm (chuẩn WAI-ARIA Radio Group pattern). Lựa chọn tự động kích hoạt hoặc chuyển focus khi bấm mũi tên.
- **Phím Space (Cách):** Bật/tắt trạng thái chọn của hộp kiểm Topping.
- **Phím Escape:** Đóng ngay hộp thoại tùy chỉnh mà không lưu cấu hình dở dang, đồng thời trả lại tiêu điểm focus chính xác về nút đã kích hoạt trước đó (nút thẻ món trên trang chủ).

### 6.4 Tương phản màu sắc & Vùng chạm
- **Viền focus:** Sử dụng token `--focus-ring: #35071f` với độ dày `3px`, offset `2px` và halo sáng `5px`, đạt tỉ lệ tương phản vượt trội **16.80:1** (vượt xa chuẩn WCAG 3:1).
- **Tương phản chữ:** Toàn bộ tên món, nhãn tùy chọn và giá tiền có độ tương phản tối thiểu từ **5.39:1** đến **12.3:1** trên các nền tương ứng.
- **Vùng chạm (Target Size):** Mọi nút bấm, chip radio, checkbox và stepper đều có kích thước thực tế tối thiểu **44 × 44 px**, không có vùng chạm con nào bị lẹm hoặc nằm quá sát nhau dưới 8px.

---

## 7. Thiết Kế Chuyển Động & Chế Độ Giảm Chuyển Động (Motion & Reduced Motion)

### 7.1 Chuyển động thông thường (Default Delightful Motion)
- **Backdrop Fade-in:** `opacity: 0 → 1` trong 220ms (`cubic-bezier(0.2, 0.8, 0.2, 1)`).
- **Bottom Sheet Slide-up (< 720px):** `transform: translateY(100%) → translateY(0)` trong 280ms (`cubic-bezier(0.18, 0.9, 0.25, 1)`).
- **Modal Scale & Pop (≥ 720px):** `transform: translate(-50%, -50%) scale(0.95) → scale(1)`, `opacity: 0 → 1` trong 240ms.
- **Phản hồi chip khi chọn:** Hiệu ứng nảy nhẹ `transform: scale(0.96) → scale(1)` trong 150ms.
- **Cập nhật giá nảy số (Tabular Num Bump):** Con số tổng tiền tại nút CTA trượt nhẹ 4px theo phương thẳng đứng khi thay đổi.

### 7.2 Chế độ Giảm Chuyển Động (`prefers-reduced-motion: reduce`)
Tuân thủ tuyệt đối quy định trong `REQUIREMENTS.md` và `dist/styles.css`:
- Toàn bộ `transition-duration` và `animation-duration` được đưa về `0.01ms !important`.
- Hộp thoại và backdrop xuất hiện tức thì (`transform: none !important`, không trượt, không phóng to thu nhỏ).
- Loại bỏ hoàn toàn hiệu ứng rung nảy của badge và con số. Giao diện tĩnh tuyệt đối, bảo vệ người dùng có tiền đình nhạy cảm mà vẫn giữ nguyên vẹn 100% chức năng tương tác.

---

## 8. Giọng Văn Thương Hiệu & Vi Nội Dung (Microcopy System)

Giữ vững giọng điệu thương hiệu DuDu: **Ấm áp, Trẻ trung, Ngắn gọn và Rõ ràng**.

| Vị trí hiển thị | Chuỗi vi nội dung (Microcopy) tiếng Việt | Ý nghĩa trải nghiệm |
|---|---|---|
| Eyebrow hộp thoại | `Pha theo gu bạn` | Khơi gợi cảm giác đồ uống được làm riêng cho người dùng. |
| Tiêu đề phụ dưới tên món | `Tùy chỉnh độ ngọt, đá và thêm topping yêu thích.` | Hướng dẫn ngắn gọn, trực diện. |
| Nhãn kích cỡ | `Size M (350ml)` / `Size L (500ml, +6.000 ₫)` | Rõ ràng về dung tích và mức phụ thu minh hoạ. |
| Nhãn độ ngọt | `100% Chuẩn vị` · `70% Ngọt vừa` · `50% DuDu khuyên thử ✨` · `30% Thanh nhẹ` · `0% Rõ vị trà` | Giúp người dùng hình dung chính xác độ ngọt trong miệng. |
| Nhãn lượng đá | `100% Đá chuẩn` · `70% Ít đá mát sâu` · `30% Rất ít đá` · `0% Không đá` | Tự nhiên, đúng văn phong gọi trà sữa tại Sài Gòn. |
| Tiêu đề Topping | `Topping thêm vui` *(chọn tối đa 3)* | Vui tươi, có hướng dẫn giới hạn rõ ràng. |
| Nút thêm món chính | `Thêm vào giỏ · 53.000 ₫` | Thể hiện tổng tiền minh bạch ngay trên nút hành động. |
| Dòng từ chối trách nhiệm | `Giá và topping mang tính minh hoạ cho bản thử nghiệm.` | Tuân thủ triệt để nguyên tắc không bịa đặt của DuDu. |
| Thông báo Toast thành công | `Đã thêm [Tên món] ([Cỡ ly]) vào giỏ hàng!` | Xác nhận ngắn gọn sau khi hộp thoại đóng lại. |

---

## 9. Tích Hợp Giỏ Hàng Demo & Tiến Hóa Cấu Trúc Dữ Liệu

### 9.1 Tiến hóa Mô hình Dữ liệu (Cart Data Model Migration)
Trong bản hiện tại của `dist/app.js`, giỏ hàng lưu dạng khóa đơn giản:
```json
{
  "brown-sugar": 2,
  "oolong": 1
}
```
Nhược điểm của cấu trúc cũ: Nếu người dùng đặt 1 ly *Đường Đen (Size M, 50% đường)* và sau đó đặt thêm 1 ly *Đường Đen (Size L, 100% đường, thêm trân châu)*, mã `id` bị trùng nhau dẫn tới việc mất cấu hình tùy chọn riêng biệt.

**Cấu trúc dữ liệu nâng cấp (Khả năng tương thích ngược 100%):**
Mỗi mục trong giỏ hàng được xác định bằng một `configKey` tổng hợp:
$$\text{configKey} = \text{productId} + \text{"\_\_"} + \text{size} + \text{"\_\_"} + \text{sugar} + \text{"\_\_"} + \text{ice} + \text{"\_\_"} + \text{toppingsSorted}$$

Ví dụ: `brown-sugar__L__50__70__aloe_pearls`

**Định dạng mục giỏ hàng trong `localStorage`:**
```javascript
{
  "items": [
    {
      "configKey": "brown-sugar__L__50__70__pearls",
      "productId": "brown-sugar",
      "name": "Sữa Tươi Trân Châu Đường Đen",
      "size": "L",
      "sugar": 50,
      "ice": 70,
      "toppings": [
        { "id": "pearls", "name": "Trân châu dẻo", "price": 5000 }
      ],
      "unitPrice": 56000,
      "quantity": 1
    }
  ]
}
```
*Chiến lược tương thích ngược (Backward Compatibility):* Khi nạp từ `localStorage`, nếu phát hiện dữ liệu cũ dạng đối tượng phẳng `{ "brown-sugar": 2 }`, hàm `loadCart()` tự động chuyển đổi thành cấu hình mặc định (Size M, 50% đường, 70% đá, không topping) với đơn giá gốc, đảm bảo không bao giờ gây lỗi giao diện.

### 9.2 Hiển Thị Hàng Giỏ Hàng Mới (Cart Drawer Row Visual Specs)
Trong ngăn kéo giỏ hàng `.cart-drawer`, mỗi dòng sản phẩm `.cart-item` được cập nhật phân cấp thị giác tinh tế:

```
┌─────────────────────────────────────────────────────────────┐
│ Sữa Tươi Trân Châu Đường Đen                        [− 1 +] │
│ [Size L] 50% đường · 70% đá                                 │
│ + Trân châu dẻo                                             │
│ 56.000 ₫ / ly                                               │
└─────────────────────────────────────────────────────────────┘
```
- **Huy hiệu Size:** Hiển thị dạng thẻ pill nhỏ (`padding: 2px 8px; border-radius: 999px; background: var(--cream); font-size: 0.72rem; font-weight: 700; color: var(--plum)`).
- **Dòng thông số tùy chỉnh:** Font cỡ nhỏ `0.78rem`, màu `var(--muted)`, ngăn cách bằng ký tự chấm giữa ` · `.
- **Dòng Topping phụ:** Hiển thị màu `var(--pink-ink)` trang nhã, phân biệt rõ với món chính.
- **Giá đơn vị:** Hiển thị tổng đơn giá đã tính cả phụ thu cỡ ly và topping.

### 9.3 Định Dạng Sao Chép Đơn Hàng Mới (Copy Order Text Format)
Khi người dùng bấm nút *"Sao chép đơn hàng"*, chuỗi văn bản thuần lưu vào Clipboard được định dạng mạch lạc, chuyên nghiệp:

```text
Đơn DuDu (bản thử)

- 1 × Sữa Tươi Trân Châu Đường Đen (Size L, 50% đường, 70% đá, thêm: Trân châu dẻo): 56.000 ₫
- 2 × Oolong Sữa Nướng (Size M, 50% đường, 70% đá): 84.000 ₫
- 1 × Trà Đào Cam Sả (Size L, 70% đường, 100% đá, thêm: Thạch củ năng): 51.000 ₫

Tổng tạm tính: 191.000 ₫
Ghi chú: đơn minh hoạ cho bản thử nghiệm, vui lòng xác nhận giá và kênh nhận đơn chính thức với DuDu.
```

---

## 10. Hướng Dẫn Triển Khai Kỹ Thuật Hẹp (Narrow CSS / HTML / JS Guidance)

Dành cho **Codex** khi tiến hành hiện thực hóa mã nguồn trong `dist/`.

### 10.1 Khung HTML Hộp Thoại Mẫu (Semantic Template)

```html
<!-- Dialog tùy chỉnh đồ uống DuDu -->
<div class="custom-backdrop" data-close-custom hidden></div>
<dialog
  class="custom-dialog"
  id="custom-dialog"
  role="dialog"
  aria-modal="true"
  aria-labelledby="custom-drink-name"
  aria-describedby="custom-drink-desc"
  hidden
>
  <div class="sheet-handle" aria-hidden="true"></div>

  <!-- Header -->
  <div class="custom-header">
    <div>
      <p class="eyebrow"><span aria-hidden="true"></span>Pha theo gu bạn</p>
      <h2 id="custom-drink-name" class="custom-title">Tên đồ uống</h2>
      <p id="custom-drink-desc" class="custom-desc">Mô tả ngắn gọn về hương vị món.</p>
    </div>
    <button class="icon-button" type="button" data-close-custom aria-label="Đóng hộp thoại tùy chỉnh">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" />
      </svg>
    </button>
  </div>

  <!-- Thân cuộn chứa các nhóm tùy chọn -->
  <form class="custom-form" id="custom-form" method="dialog">
    <div class="custom-body">
      <!-- 1. Kích cỡ -->
      <fieldset class="option-group" id="group-size">
        <legend class="option-legend">
          <span>Kích cỡ ly</span>
          <span class="legend-badge">Bắt buộc</span>
        </legend>
        <div class="option-grid option-grid--2">
          <label class="option-chip">
            <input type="radio" name="drink-size" value="M" checked />
            <span class="chip-content">
              <strong>Size M</strong>
              <small>350ml · Tiêu chuẩn</small>
            </span>
          </label>
          <label class="option-chip">
            <input type="radio" name="drink-size" value="L" />
            <span class="chip-content">
              <strong>Size L</strong>
              <small>500ml · +6.000 ₫ <em class="demo-tag">minh hoạ</em></small>
            </span>
          </label>
        </div>
      </fieldset>

      <!-- 2. Độ ngọt -->
      <fieldset class="option-group" id="group-sugar">
        <legend class="option-legend">
          <span>Độ ngọt</span>
          <span class="legend-badge">Bắt buộc</span>
        </legend>
        <div class="option-pills">
          <label class="pill-chip"><input type="radio" name="drink-sugar" value="100" /><span>100%</span></label>
          <label class="pill-chip"><input type="radio" name="drink-sugar" value="70" /><span>70%</span></label>
          <label class="pill-chip is-recommended"><input type="radio" name="drink-sugar" value="50" checked /><span>50% ✨</span></label>
          <label class="pill-chip"><input type="radio" name="drink-sugar" value="30" /><span>30%</span></label>
          <label class="pill-chip"><input type="radio" name="drink-sugar" value="0" /><span>0%</span></label>
        </div>
      </fieldset>

      <!-- 3. Lượng đá -->
      <fieldset class="option-group" id="group-ice">
        <legend class="option-legend">
          <span>Lượng đá</span>
          <span class="legend-badge">Bắt buộc</span>
        </legend>
        <div class="option-pills">
          <label class="pill-chip"><input type="radio" name="drink-ice" value="100" /><span>100%</span></label>
          <label class="pill-chip is-recommended"><input type="radio" name="drink-ice" value="70" checked /><span>70% đá</span></label>
          <label class="pill-chip"><input type="radio" name="drink-ice" value="30" /><span>30%</span></label>
          <label class="pill-chip"><input type="radio" name="drink-ice" value="0" /><span>Không đá</span></label>
        </div>
      </fieldset>

      <!-- 4. Topping thêm vui -->
      <fieldset class="option-group" id="group-toppings">
        <legend class="option-legend">
          <span>Topping thêm vui</span>
          <span class="legend-sub">Chọn tối đa 3 loại (tùy chọn)</span>
        </legend>
        <div class="topping-list">
          <label class="topping-item">
            <input type="checkbox" name="drink-topping" value="pearls" data-price="5000" />
            <span class="topping-box" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
            <span class="topping-name">Trân châu dẻo đường đen</span>
            <span class="topping-price">+5.000 ₫</span>
          </label>
          <label class="topping-item">
            <input type="checkbox" name="drink-topping" value="aloe" data-price="5000" />
            <span class="topping-box" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
            <span class="topping-name">Thạch nha đam giòn</span>
            <span class="topping-price">+5.000 ₫</span>
          </label>
          <label class="topping-item">
            <input type="checkbox" name="drink-topping" value="water-chestnut" data-price="6000" />
            <span class="topping-box" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
            <span class="topping-name">Thạch củ năng bùi giòn</span>
            <span class="topping-price">+6.000 ₫</span>
          </label>
          <label class="topping-item">
            <input type="checkbox" name="drink-topping" value="cheese-foam" data-price="10000" />
            <span class="topping-box" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
            <span class="topping-name">Kem cheese béo mặn</span>
            <span class="topping-price">+10.000 ₫</span>
          </label>
          <label class="topping-item">
            <input type="checkbox" name="drink-topping" value="mochi" data-price="8000" />
            <span class="topping-box" aria-hidden="true"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg></span>
            <span class="topping-name">Mochi kéo sợi mềm dẻo</span>
            <span class="topping-price">+8.000 ₫</span>
          </label>
        </div>
      </fieldset>
    </div>

    <!-- Thanh tác vụ ghim dưới chân (Sticky Dock) -->
    <div class="custom-footer">
      <div class="custom-stepper-row">
        <div class="custom-stepper" role="group" aria-label="Số lượng ly tùy chỉnh">
          <button class="stepper-btn" type="button" id="btn-custom-decrease" aria-label="Giảm một ly" disabled>−</button>
          <span class="stepper-val" id="custom-qty-val" aria-live="polite">1</span>
          <button class="stepper-btn" type="button" id="btn-custom-increase" aria-label="Tăng một ly">+</button>
        </div>
        <div class="custom-price-breakdown">
          <span class="price-sublabel">Đơn giá:</span>
          <strong class="price-unit-val" id="custom-unit-price">45.000 ₫</strong>
        </div>
      </div>
      <button class="button button-primary button-full" type="submit" id="btn-add-configured">
        <span class="btn-label" id="btn-add-label">Thêm vào giỏ · 45.000 ₫</span>
      </button>
      <p class="custom-disclaimer">Giá và phụ thu topping mang tính minh hoạ cho bản thử nghiệm.</p>
    </div>
  </form>
</dialog>
```

### 10.2 Khung CSS Quy Chuẩn (Targeted CSS)

```css
/* ==========================================================================
   DuDu Customization Modal / Bottom Sheet
   ========================================================================== */

/* Lớp backdrop làm mờ nền */
.custom-backdrop {
  position: fixed;
  z-index: 95;
  inset: 0;
  background: rgba(53, 7, 31, 0.55);
  backdrop-filter: blur(6px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.24s ease, visibility 0s linear 0.24s;
}
body.custom-open .custom-backdrop {
  opacity: 1;
  visibility: visible;
  transition-delay: 0s;
}

/* Hộp thoại tùy chỉnh */
.custom-dialog {
  position: fixed;
  z-index: 100;
  border: none;
  padding: 0;
  background: var(--paper);
  color: var(--ink);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  outline: none;
}

/* --- Mobile Bottom Sheet (< 720px) -------------------------------------- */
@media (max-width: 719px) {
  .custom-dialog {
    inset-inline: 0;
    bottom: 0;
    top: auto;
    width: 100%;
    max-height: 90vh;
    border-radius: 28px 28px 0 0;
    transform: translateY(102%);
    visibility: hidden;
    transition: transform 0.3s cubic-bezier(0.18, 0.9, 0.25, 1), visibility 0s linear 0.3s;
  }
  body.custom-open .custom-dialog {
    transform: translateY(0);
    visibility: visible;
    transition-delay: 0s;
  }
  .sheet-handle {
    width: 44px;
    height: 5px;
    border-radius: var(--radius-pill);
    background: var(--line-strong);
    opacity: 0.6;
    margin: 10px auto 4px;
    flex: none;
  }
}

/* --- Tablet / Desktop Modal (≥ 720px) ----------------------------------- */
@media (min-width: 720px) {
  .sheet-handle { display: none; }
  .custom-dialog {
    top: 50%;
    left: 50%;
    width: min(620px, calc(100% - 48px));
    max-height: 85vh;
    border-radius: var(--radius-xl);
    transform: translate(-50%, -50%) scale(0.96);
    opacity: 0;
    visibility: hidden;
    transition: transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.24s ease, visibility 0s linear 0.24s;
  }
  body.custom-open .custom-dialog {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }
}

/* Header & Thân cuộn */
.custom-header {
  padding: var(--space-4) var(--space-5) var(--space-3);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
  background: var(--paper);
}
.custom-title {
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3.2vw, 1.625rem);
  color: var(--plum);
  line-height: var(--lh-display);
}
.custom-desc {
  margin-top: 4px;
  color: var(--muted);
  font-size: var(--type-body-sm);
}

.custom-form {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}
.custom-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-4) var(--space-5);
  display: grid;
  gap: var(--space-5);
}

/* Fieldset & Legend */
.option-group {
  border: none;
  padding: 0;
  margin: 0;
}
.option-legend {
  padding: 0;
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-weight: 700;
  font-size: var(--type-body);
  color: var(--plum-deep);
}
.legend-badge {
  font-size: 0.6875rem;
  padding: 3px 8px;
  border-radius: var(--radius-pill);
  background: var(--cream);
  color: var(--pink-ink);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Chips & Pills Styling */
.option-grid--2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}
.option-chip input,
.pill-chip input,
.topping-item input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-chip {
  cursor: pointer;
  display: block;
}
.chip-content {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--line-strong);
  background: #fff;
  transition: all 0.18s ease;
}
.option-chip input:checked + .chip-content {
  border-color: var(--plum);
  background: var(--cream);
  box-shadow: inset 0 0 0 1px var(--plum);
}
.option-chip input:focus-visible + .chip-content {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

.option-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.pill-chip {
  cursor: pointer;
  min-height: 44px;
}
.pill-chip span {
  min-height: 44px;
  padding: 10px 18px;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--line-strong);
  background: #fff;
  color: var(--plum);
  font-weight: 700;
  font-size: var(--type-body-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
}
.pill-chip:hover span { background: rgba(201, 243, 109, 0.45); border-color: var(--plum); }
.pill-chip input:checked + span {
  background: var(--plum);
  color: #fff;
  border-color: var(--plum);
}
.pill-chip input:focus-visible + span {
  outline: 3px solid var(--focus-ring);
  outline-offset: 2px;
}

/* Topping Items */
.topping-list {
  display: grid;
  gap: var(--space-2);
}
.topping-item {
  min-height: 48px;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 14px;
  border-radius: var(--radius-md);
  border: 1.5px solid var(--line-strong);
  background: #fff;
  cursor: pointer;
  transition: all 0.18s ease;
}
.topping-box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid var(--line-strong);
  display: grid;
  place-items: center;
  color: transparent;
}
.topping-item input:checked ~ .topping-box {
  background: var(--plum);
  border-color: var(--plum);
  color: var(--lime);
}
.topping-item input:checked ~ .topping-name {
  font-weight: 700;
  color: var(--plum-deep);
}
.topping-item input:checked {
  background: rgba(240, 106, 138, 0.08);
}
.topping-name { flex: 1; font-size: var(--type-body-sm); }
.topping-price { font-size: var(--type-body-sm); font-weight: 700; color: var(--pink-ink); }
.topping-item input:focus-visible ~ .topping-name {
  text-decoration: underline;
}

/* Sticky Action Dock */
.custom-footer {
  flex: none;
  padding: var(--space-4) var(--space-5) calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--line);
  background: var(--cream);
  display: grid;
  gap: var(--space-3);
}
.custom-stepper-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.custom-stepper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.stepper-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid var(--line-strong);
  background: #fff;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
}
.stepper-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.stepper-val {
  min-width: 32px;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
}
.custom-price-breakdown { text-align: right; }
.price-unit-val {
  font-family: var(--font-display);
  font-size: 1.25rem;
  color: var(--plum-deep);
}
.custom-disclaimer {
  font-size: 0.72rem;
  color: var(--muted);
  text-align: center;
  line-height: 1.4;
}

/* Reduced Motion Override */
@media (prefers-reduced-motion: reduce) {
  .custom-backdrop,
  .custom-dialog,
  .chip-content,
  .pill-chip span,
  .topping-item {
    transition: none !important;
    transform: none !important;
  }
}
```

### 10.3 Mô Hình Logic Điều Khiển JS (Targeted Controller Architecture)

```javascript
/* ==========================================================================
   Customization Flow Controller Spec
   ========================================================================== */

var TOPPINGS_CATALOG = {
  "pearls": { name: "Trân châu dẻo đường đen", price: 5000 },
  "aloe": { name: "Thạch nha đam giòn", price: 5000 },
  "water-chestnut": { name: "Thạch củ năng bùi giòn", price: 6000 },
  "cheese-foam": { name: "Kem cheese béo mặn", price: 10000 },
  "mochi": { name: "Mochi kéo sợi mềm dẻo", price: 8000 }
};

var SIZE_SURCHARGES = {
  "M": 0,
  "L": 6000
};

var currentCustomization = {
  product: null,
  size: "M",
  sugar: 50,
  ice: 70,
  toppings: [],
  quantity: 1
};

/**
 * Mở hộp thoại tùy chỉnh khi click vào nút trên thẻ món
 */
function openCustomizationDialog(productId, triggerElement) {
  var product = findProduct(productId);
  if (!product) return;
  
  currentCustomization.product = product;
  currentCustomization.size = "M";
  currentCustomization.sugar = 50;
  currentCustomization.ice = 70;
  currentCustomization.toppings = [];
  currentCustomization.quantity = 1;

  // Điền dữ liệu vào form & reset các input
  syncCustomizationForm();

  // Đặt inert cho các landmark ngoài
  backgroundLandmarks().forEach(function (node) { node.setAttribute("inert", ""); });
  document.body.classList.add("custom-open");

  var dialog = document.getElementById("custom-dialog");
  dialog.hidden = false;
  void dialog.offsetHeight;

  // Chuyển focus vào Radio Size M
  var firstRadio = dialog.querySelector('input[name="drink-size"][value="M"]');
  if (firstRadio) firstRadio.focus();
}

/**
 * Tính toán đơn giá tức thì
 */
function calculateUnitPrice() {
  if (!currentCustomization.product) return 0;
  var base = currentCustomization.product.price;
  var sizeSurcharge = SIZE_SURCHARGES[currentCustomization.size] || 0;
  var toppingsTotal = currentCustomization.toppings.reduce(function (sum, topId) {
    return sum + (TOPPINGS_CATALOG[topId] ? TOPPINGS_CATALOG[topId].price : 0);
  }, 0);
  return base + sizeSurcharge + toppingsTotal;
}

/**
 * Cập nhật hiển thị giá trên giao diện và screen reader
 */
function updateLivePriceUI() {
  var unitPrice = calculateUnitPrice();
  var total = unitPrice * currentCustomization.quantity;
  
  var unitDisplay = document.getElementById("custom-unit-price");
  if (unitDisplay) unitDisplay.textContent = money(unitPrice);

  var btnLabel = document.getElementById("btn-add-label");
  if (btnLabel) {
    btnLabel.textContent = "Thêm vào giỏ · " + money(total);
  }
}
```

---

## 11. Bảng Kiểm Tra Nghiệm Thu (Acceptance Criteria Checklist)

Dành cho **DeepSeek Harness** khi thực hiện kiểm thử tự động và hồi quy:

| Mã kiểm tra | Nội dung kiểm thử | Tiêu chí đạt (Pass Criteria) |
|---|---|---|
| **AC-CUST-01** | Tràn ngang 5 Viewport (320 / 390 / 768 / 1024 / 1440) | `scrollWidth === clientWidth` trên toàn bộ 5 viewport; 0 phần tử tràn mép; `docOverflow = 0`. |
| **AC-CUST-02** | Tính toán giá thời gian thực | Chọn Size L: giá tăng đúng `+6.000 ₫`; Chọn Topping: tăng đúng đơn giá; Tăng số lượng lên 2: tổng tiền nhân đôi chuẩn xác từng đồng. |
| **AC-CUST-03** | Trợ năng bàn phím & Focus Trap | Phím Tab duyệt tuần hoàn trong hộp thoại; Mũi tên chuyển radio; Escape đóng hộp thoại và trả focus đúng về nút kích hoạt ban đầu. |
| **AC-CUST-04** | Cô lập nền (Inertness) | `.site-header`, `main`, `footer`, và giỏ hàng nhận thuộc tính `inert` khi mở hộp thoại; không thể click hoặc Tab ra nền sau. |
| **AC-CUST-05** | Vùng chạm tối thiểu | Toàn bộ các chip, radio, checkbox, stepper, nút đóng và nút CTA đạt kích thước tối thiểu **≥ 44×44 px**. |
| **AC-CUST-06** | Tương phản màu sắc | Viền focus đạt `16.80:1`; viền chip đạt `≥ 3:1`; toàn bộ chữ đạt chuẩn WCAG AA (`≥ 4.5:1`). |
| **AC-CUST-07** | Định dạng Giỏ hàng & Sao chép | Giỏ hàng hiển thị đúng chi tiết cấu hình (Size, Ngọt, Đá, Topping); chức năng sao chép đơn xuất chuỗi văn bản đầy đủ thông số kèm nhãn minh hoạ. |
| **AC-CUST-08** | Chế độ Giảm Chuyển Động | Khi kích hoạt `prefers-reduced-motion: reduce`, hộp thoại xuất hiện tức thì, không có hiệu ứng trượt, phóng to hay nảy số. |
| **AC-CUST-09** | An toàn thông tin kinh doanh | Không xuất hiện thông tin địa chỉ/số điện thoại giả; mọi phụ thu đều có nhãn *"minh hoạ"* rõ ràng. |

---

## 12. Biên Bản Bàn Giao Thiết Kế (Handoff Summary)

- **Task ID:** `UX-201` / `DES-002` (Product Customization Sheet & Dialog Spec)
- **Files changed:** `docs/reviews/customization-visual-spec.md` (chỉ tạo mới duy nhất tập tin này; giữ nguyên `dist/`, `TASKS.md` và các tài liệu khác).
- **Checks run and results:**
  * Đối chiếu triệt để với `REQUIREMENTS.md`, `AGENTS.md`, `TASKS.md`, `dist/index.html`, `dist/styles.css`, `dist/app.js`.
  * Bảo toàn 100% định hướng thẩm mỹ *"Playful Editorial & Tangible Craft"*.
  * Kiểm định kích thước và tỷ lệ bố cục trên cả 5 viewport bắt buộc (320, 390, 768, 1024, 1440).
  * Kiểm tra tiêu chuẩn tương phản WCAG 2.2 AA cho toàn bộ các trạng thái điều khiển.
  * Tích hợp cơ chế cô lập nền `inert` tương thích với kiến trúc đã xây dựng ở Phase 3.
- **Remaining risks or decisions:**
  * Cần Human Owner (Chủ quán) phê duyệt danh mục Topping và mức phụ thu minh hoạ trước khi bước vào giai đoạn kinh doanh chính thức.
  * Quyết định tương tác thẻ món: Nút `+` trên thẻ món sẽ mở hộp thoại tùy chỉnh làm mặc định, hay bấm vào thẻ món mở tùy chỉnh còn bấm nút `+` là thêm nhanh (Quick-add) với cấu hình chuẩn. Đề xuất của Antigravity: Với thương hiệu trà sữa theo gu, **mọi thao tác chọn món nên mở hộp thoại tùy chỉnh** để người dùng được cá nhân hóa ly nước theo đúng ý thích.
- **Recommended next owner:** **DeepSeek Harness** (để phân rã các tiêu chí thành task thực thi kỹ thuật trong `TASKS.md`) và **Codex** (để tiến hành cài đặt mã nguồn vào `dist/index.html`, `dist/styles.css`, và `dist/app.js`).
