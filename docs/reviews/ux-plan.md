# Phase 3 — Biên bản phân loại (triage) đề xuất Antigravity

- **Người thực hiện:** DeepSeek Harness (điều phối & QA)
- **Nguồn đề xuất:** `docs/reviews/antigravity-art-direction.md` — UX-000, agy conversation `a9b72822-843d-47b5-9634-1ae21bcb9309`, model Gemini
- **Phạm vi:** 20 mục, 11 đề xuất có mã (MUST-01..04, SHOULD-01..04, NICE-01..03) + 2 phát hiện do QA nội bộ đo được
- **Bàn giao kèm:** `TASKS.md` (bảng công việc Phase 3)
- **Nguyên tắc:** không sửa `dist/` trong bước này; không bịa thông tin kinh doanh; giữ nguyên nhận diện Plum / Cream / Pink / Lime và cặp font Fraunces + Be Vietnam Pro.

## 1. Phương pháp

Mỗi đề xuất của Antigravity được kiểm tra lại độc lập trước khi chấp nhận:

1. **Đối chiếu mã nguồn thật.** Đọc lại `dist/index.html`, `dist/styles.css`, `dist/app.js` để xác nhận selector, token và hành vi mà báo cáo nhắc tới có tồn tại đúng như mô tả (ví dụ `height="1024"` tại `index.html:56`, `aspect-ratio` tại `styles.css:146`, `:focus-visible` tại `styles.css:244`).
2. **Đo lại bằng headless Chromium.** Mọi đề xuất ảnh hưởng tới layout, tương phản hoặc vùng chạm đều được đo trực tiếp trên 5 viewport 320×568, 390×844, 768×1024, 1024×768, 1440×900: bounding rect, computed style, `document.elementFromPoint`, và `scrollWidth` so với `clientWidth`.
3. **Tính lại tương phản.** Các tỷ lệ WCAG được tính lại bằng công thức relative luminance của WCAG 2.1/2.2 trên đúng cặp màu đang render.
4. **Phân loại có kỷ luật.**
   - `Accepted` — đo được đúng như báo cáo và cách sửa không đổi phạm vi sản phẩm.
   - `Accepted with correction` — vấn đề có thật nhưng mức độ, nguyên nhân hoặc hệ quả bị mô tả sai.
   - `Rejected` — số liệu sai, hoặc thay đổi sản phẩm/phạm vi đã được chốt.
   - `Needs owner decision` — thuộc quyền chủ quán, người triển khai không thể tự đóng.
5. **Báo cáo của Antigravity là đầu vào tham khảo, không phải danh sách việc phải làm.** Kết quả phân loại nằm ở §2, đính chính số liệu ở §3, lý do bác ở §4, ánh xạ sang task ở §5.

## 2. Bảng phân loại

| Mã | Đề xuất của Antigravity | Phân loại | Bằng chứng kiểm chứng | Ghi chú |
|---|---|---|---|---|
| MUST-01 | Ảnh hero bị ép cao 1024px trên mọi viewport; cần `height: auto` + `aspect-ratio` thật | Accepted | `index.html:56` có `height="1024"` (presentational hint) thắng khai báo CSS; `.hero-visual img` (`styles.css:146`) có `aspect-ratio` nhưng thiếu `height: auto`. Đo trực tiếp: ảnh render đúng **1024px** ở cả 5 viewport | Hướng sửa giữ nguyên; số liệu crop bị đính chính ở §3.1 |
| MUST-02 | Toast `#toast` (z-index 110) đè nút `#copy-order`, chặn bấm trong 1,8 giây | Accepted with correction | Đè thật ở 320px và 390px. Nhưng toast có `pointer-events: none`; `elementFromPoint` tại tâm nút trả về `#copy-order` → **không** chặn bấm | Hạ mức High → Medium; vẫn sửa vì là lỗi chồng lớp thị giác |
| MUST-03 | Dấu tiếng Việt va chạm và từ mồ côi trên tiêu đề mobile | Accepted | Tại 320px: hero `h1` bị ngắt thành **3 dòng**; story `h2` vỡ thành **5 dòng** với "kỳ." mồ côi, floor clamp quá cao | Sửa: nâng line-height, hạ floor clamp, thêm `text-wrap: balance` sau `@supports` |
| MUST-04 | Viền focus `#f06a8a` trượt chuẩn tương phản WCAG | Accepted | `outline: 3px solid #f06a8a` (`styles.css:244`) = **2,72:1** trên nền cream, dưới mức tối thiểu 3:1 | Đổi sang focus ring mận đậm |
| SHOULD-01 | Link nav mobile chỉ là text trần, dưới 44px | Accepted | Tại 320px, `.desktop-nav a` đo được **39×24,3 / 97,7×24,3 / 69,5×24,3 px** | Chuyển thành pill nav, vùng chạm ≥ 44px |
| SHOULD-02 | Trà trái cây vẽ kèm trân châu đen | Accepted | Cả **6** thẻ đều render `.pearls` với cùng gradient `rgb(53,7,31)` (`#35071f`) | Ly theo nhóm vị: trà sữa và trà trái cây |
| SHOULD-03 | Skip-link hiện khi focus lập trình và đè lên tiêu đề | Accepted (mức thấp) | Nguồn: `.skip-link:focus { top: 16px }` (`styles.css:50`) dùng `:focus` chứ không phải `:focus-visible` | Không tái hiện được cảnh "đè tiêu đề"; gộp vào A11Y-101, QA-101 xác nhận lại |
| SHOULD-04 | Hero 768px bị dồn thành một cột rất cao | Accepted | Tại 768px hero là một cột dọc rất dài; breakpoint 980px dồn cột | Giữ hero 2 cột từ 641px và chặn chiều cao |
| NICE-01 | Badge giỏ hàng nảy khi số lượng tăng | Accepted | Micro-interaction nhỏ, không đổi cấu trúc | Phải tắt dưới `prefers-reduced-motion` |
| NICE-02 | Khung "xem trước đơn hàng" dạng vé xem phim | Rejected | Không cần cho tiêu chí copy đơn; `.cart-summary` đã có tạm tính, nút copy và trạng thái copy | Ngoài phạm vi — xem §4.4 |
| NICE-03 | Tạm dừng marquee khi hover | Accepted | `.ticker-track` chạy vô hạn, không có `animation-play-state` | Thêm pause khi hover |
| QA-ADD-01 | (QA nội bộ) Nút `.add-button` chỉ 42×42px | Accepted | Xác nhận trong `docs/reviews/qa.md:69`: `.add-button` 42×42; đây cũng là ca trượt **duy nhất** của suite nền 52/53 | Gán vào UI-104 |
| QA-ADD-02 | (QA nội bộ) `.cart-empty > span` màu `#f06a8a` trên paper = 2,83:1 | Accepted | 2,83:1 < 3:1 cho non-text contrast (WCAG 1.4.11) | Gán vào UI-105 |
| BIZ-001 | (Không phải đề xuất thiết kế) giá, địa chỉ, điện thoại, giờ mở cửa, kênh nhận đơn | Needs owner decision | `REQUIREMENTS.md` §Current business assumptions: các dữ liệu này chưa biết | Giữ nhãn "đang cập nhật" tới khi chủ quán xác nhận |
| BIZ-002 | (Không phải đề xuất thiết kế) tự host font và duyệt giọng văn thương hiệu | Needs owner decision | `index.html:9-11` đang nạp Fraunces + Be Vietnam Pro từ Google Fonts; tiêu chí "loads with local assets" | Gồm cả thẻ "06 món minh hoạ" và câu quote ghi "DuDu nhắn bạn" |

## 3. Đính chính số liệu của Antigravity

### 3.1 Con số "ly Matcha bị crop 80%"
Báo cáo (MUST-01, mục 8) viết ly Matcha mất 80% chiều rộng. Đo lại: với `object-position: 58%`, cửa sổ nguồn nhìn thấy nằm trong khoảng **x ≈ 107..1459** trên ảnh rộng 1536px, nên phần cắt ở mép phải chỉ khoảng **46px (~3% chiều rộng ảnh)**. Lỗi 1024px là thật và cách sửa không đổi, nhưng mức độ bị phóng đại khoảng 20 lần.

### 3.2 Toast "chặn" nút sao chép
Báo cáo (MUST-02, mục 11) mô tả người dùng "không thể bấm trong 1,8 giây". Đo lại: toast có `pointer-events: none`, và `elementFromPoint` tại tâm `#copy-order` trả về chính `#copy-order`. Sự chồng lớp là thật; việc chặn bấm là sai. Mức độ hạ từ High xuống Medium và ghi là "accepted with correction".

### 3.3 Sticker bị container hero cắt
Báo cáo (mục 8) nói sticker "3 vị đúng gu" bị khung hero cắt. Đo tại 320px: mép phải sticker **298,3px**, mép phải hero **310px** → sticker nằm trọn trong khung, **không bị cắt**. Vẫn chỉnh vị trí và kích thước sticker như một phần thẩm mỹ của UI-103, nhưng không phải lỗi crop.

### 3.4 Reduced motion làm drawer "giật phụt"
Báo cáo (mục 13, AC-08) nói dưới `prefers-reduced-motion: reduce` drawer "snap" và làm người dùng giật mình. Đo lại: drawer đã về trạng thái tức thời, không còn animation. Đó là hành vi đúng và mong đợi của reduced motion; vì không có chuyển động nên không tồn tại rủi ro tiền đình.

### 3.5 Skip-link "đè lên tiêu đề"
Không tái hiện được hiện tượng che tiêu đề trong đợt đo này. Vấn đề thật ở mức mã nguồn chỉ là `.skip-link` dùng `:focus` thay vì `:focus-visible`, nên đề xuất SHOULD-03 được chấp nhận ở mức thấp và phải qua QA-101 xác nhận lại.

## 4. Các đề xuất bị bác

### 4.1 (Rejected) Con số crop 80% trong MUST-01 / mục 8
Lý do: số liệu sai (xem §3.1). Cách sửa được giữ, nhưng bằng chứng không được dùng làm tiêu chí nghiệm thu.

### 4.2 (Rejected) Sticker bị container hero cắt
Lý do: đo tại 320px cho thấy sticker nằm trong khung (298,3px so với 310px). Không có lỗi để sửa; chỉ còn tinh chỉnh thẩm mỹ trong UI-103.

### 4.3 (Rejected) Emoji trong chip lọc và filter thứ tư "Ít ngọt thanh lành"
Báo cáo mục 9 đề xuất "🧋 Trà sữa đậm vị", "🍓 Trà trái cây", "✨ Ít ngọt thanh lành" và thêm một bộ lọc thứ tư. Lý do bác:
- `REQUIREMENTS.md` chốt menu gồm **6 món minh hoạ, 2 nhóm vị**; `index.html:89-91` đang có đúng **3 chip** lọc. Thêm chip thứ tư là đổi taxonomy đã được duyệt, không phải sửa lỗi.
- Emoji render khác nhau giữa Windows, Android và iOS, không kiểm soát được tương phản/kích thước, và không thêm thông tin cho người dùng screen reader.
- Nhãn "Ít ngọt thanh lành" gần nghĩa với mô tả món "Ít ngọt ngon" hiện có, dễ gây trùng lặp phân loại.

### 4.4 (Rejected) Nút copy đổi màu lime khi thành công + khung "receipt preview" kiểu vé xem phim
Báo cáo mục 11 và NICE-02 đề xuất nút `#copy-order` chuyển sang lime `#c9f36d` và thêm một khung xem trước dạng vé. Lý do bác:
- `REQUIREMENTS.md` chỉ yêu cầu thao tác copy đơn hoạt động; `#copy-status` đã có `aria-live` để phản hồi.
- Một trạng thái thành công inline rõ ràng là đủ; thêm khung trang trí là scope creep không có tiêu chí nghiệm thu.
- Đổi nút hành động chính sang lime phá ngôn ngữ màu đang dùng (lime là màu chip lọc, plum là màu hành động) và không cải thiện tương phản.

### 4.5 (Rejected) Thay transition drawer bằng fade opacity dưới reduced motion
Báo cáo mục 13 đề xuất bỏ `transform: none` và thêm `transition: opacity`. Lý do bác: không có chuyển động nào để giảm (xem §3.4); thêm fade 0,15s là **tăng** chuyển động và tạo trạng thái trung gian không cần thiết.

### 4.6 (Hoãn, ngoài Phase 3) Các đề xuất không có mã ưu tiên
| Đề xuất (mục) | Xử lý | Lý do |
|---|---|---|
| Tìm kiếm / lọc theo "mood", hoạt ảnh `cardFadeIn` cho thẻ món (mục 9) | Hoãn | Thêm hành vi và chuyển động mới không có trong yêu cầu; ưu tiên sửa lỗi trước |
| Parallax cho sticker/caption, trang trí lại footer (mục 16) | Hoãn | Trang trí, không có tiêu chí nghiệm thu; parallax xung đột tinh thần reduced-motion |
| Giảm đậm nền caramel để tăng tương phản mô tả món (mục 4) | Hoãn | Cặp màu hiện tại đạt **4,83:1**, đã qua AA 4,5:1; đổi nền sẽ lệch token màu đã duyệt |
| Skeleton loading (mục 12) | Hoãn | Site tĩnh buildless, không có trạng thái tải bất đồng bộ |

## 5. Ánh xạ đề xuất đã chấp nhận → task

| Đề xuất | Task | Nội dung triển khai |
|---|---|---|
| MUST-01 | UI-103 | `height: auto` + `aspect-ratio` thật, canh chủ thể, đặt lại sticker/caption |
| MUST-02 | UI-105 | Đặt toast để không bao giờ phủ `#copy-order` ở 320px và 390px |
| MUST-03 | UI-101 (+ UX-101) | Thang chữ có line-height an toàn dấu tiếng Việt, hạ floor clamp, `text-wrap: balance`, dàn ý heading |
| MUST-04 | UI-101 + A11Y-101 | Token focus mận đậm đạt ≥ 3:1 và kiểm tra bằng bàn phím |
| SHOULD-01 | UI-102 | Pill nav mobile với vùng chạm ≥ 44px |
| SHOULD-02 | UI-104 | Ly theo nhóm vị, không vẽ trân châu cho trà trái cây |
| SHOULD-03 | A11Y-101 | Chỉ hiện skip-link khi `:focus-visible` |
| SHOULD-04 | UI-106 | Hero 2 cột từ 641px, chặn chiều cao ở 768px |
| NICE-01 | UI-102 (+ A11Y-101) | Badge giỏ hàng nảy khi tăng số lượng, tắt dưới reduced motion |
| NICE-03 | A11Y-101 | Tạm dừng marquee khi hover |
| QA-ADD-01 | UI-104 | `.add-button` đạt ≥ 44×44px |
| QA-ADD-02 | UI-105 | `.cart-empty > span` đạt ≥ 3:1 non-text contrast |
| Tất cả mục Accepted | QA-101, QA-003 | Harness regression 5 viewport và review thị giác sau build |
| BIZ-001, BIZ-002 | Human owner | Quyết định dữ liệu kinh doanh và host font / duyệt giọng văn |

## 6. Báo cáo của Antigravity KHÔNG được áp dụng máy móc

Tally trên 11 đề xuất có mã: **9 Accepted**, **1 Accepted with correction** (MUST-02), **1 Rejected** (NICE-02). Ngoài ra có **3 bằng chứng bị đính chính hoặc bác bỏ** (crop 80%, sticker bị cắt, toast chặn nút) và **1 cảnh báo reduced-motion bị bác** (§4.5). Hai phát hiện do QA nội bộ đo được được thêm vào kế hoạch dù Antigravity không nêu rõ mã cho chúng.

Cụ thể, báo cáo đã bị sửa lại ở bốn điểm: mức độ lỗi crop, mức độ nghiêm trọng của toast, sự tồn tại của lỗi sticker, và tính đúng đắn của hành vi reduced motion. Các đề xuất đổi taxonomy menu và đổi phạm vi phản hồi copy đều bị từ chối. Vì vậy kế hoạch Phase 3 là kết quả kiểm chứng độc lập, không phải bản sao của báo cáo.

## 7. Rủi ro còn lại

- **Font bên thứ ba (BIZ-002).** Site đang phụ thuộc Google Fonts; nếu chủ quán chọn tự host thì cần thêm `dist/assets/fonts/` và kiểm tra lại tiêu chí "loads with local assets".
- **Skip-link (SHOULD-03).** Chỉ có bằng chứng ở mức mã nguồn, chưa tái hiện được hiện tượng che tiêu đề; QA-101 phải xác nhận trước khi đóng.
- **Giọng văn thương hiệu.** Thẻ "06 món minh hoạ" và câu quote ghi "DuDu nhắn bạn" **không** bị coi là bịa đặt vì đúng sự thật minh hoạ và không gán cho khách hàng thật; chúng vẫn cần chủ quán phê duyệt trong BIZ-002.
- **Số liệu nền.** Suite nền 52/53 chỉ trượt đúng ca touch target 42px; sau khi UI-104 sửa, QA-101 phải đạt 53/53 trước khi QA-003 review.
