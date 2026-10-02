# Hướng Dẫn Quản Trị & Tải Ảnh Cloudinary Không Cần Code

Hệ thống quản lý ảnh và dự án công trình của **AnhChiNoiThat** đã được tích hợp hoàn chỉnh với **Cloudinary Official Upload Widget**, cho phép bạn tải ảnh, video trực tiếp từ máy tính hoặc điện thoại lên CDN và tự động hiển thị ra Trang Chủ (Slider) và Thư Viện Công Trình mà **không cần đụng tới bất kỳ dòng code nào**!

---

## 1. Cách truy cập trang Quản Trị (Admin Panel)

- **Đường dẫn trên trình duyệt**:
  - Khi chạy trên máy (Local): `http://localhost:3000/admin` (hoặc mở file [admin.html](file:///e:/Code/Web-Nha/pages/admin.html))
  - Khi triển khai trên Vercel: `https://ten-mien-cua-ban.vercel.app/admin`
  - Hoặc bấm vào chữ **"Quản trị"** ở chân trang (Footer) của website.
- **Mã PIN đăng nhập mặc định**: `anhchi2026`
  *(Bạn có thể đổi mã PIN mới bất cứ lúc nào trong tab **Cấu Hình & Sao Lưu**)*.

---

## 2. Kết nối tài khoản Cloudinary (Chỉ làm 1 lần duy nhất)

Để tải ảnh trực tiếp lên Cloudinary của bạn, bạn chỉ cần 2 thông tin cơ bản:
1. **Cloud Name**: Tên đám mây Cloudinary của bạn.
2. **Upload Preset (Unsigned)**: Mã tải ảnh trực tiếp từ trình duyệt.

### 📌 Các bước lấy cấu hình trong 30 giây:
1. Đăng nhập vào trang quản trị Cloudinary: [cloudinary.com/console](https://cloudinary.com/console).
2. Nhìn góc trên bên trái màn hình để copy **Cloud Name** (ví dụ: `dxyzk123`).
3. Bấm vào biểu tượng **Cài đặt (bánh răng ⚙️)** ở góc dưới bên trái → chọn tab **Upload**.
4. Cuộn xuống mục **Upload presets** → bấm **Add upload preset**:
   - Đặt tên cho preset (ví dụ: `anhchinoithat`).
   - Tại dòng **Signing Mode**: chọn **Unsigned** *(quan trọng để widget tải được từ web)*.
   - Bấm **Save** ở góc trên.
5. Quay lại trang Quản Trị website (`/admin`), chọn tab **"⚙️ Cấu Hình Cloudinary & Sao Lưu"**:
   - Dán **Cloud Name** và **Upload Preset** vào.
   - Bấm **"Kiểm Tra Kết Nối"** và bấm **"Lưu Cấu Hình"**.
   - Trạng thái sẽ chuyển sang màu xanh lá: `☁️ Đã Kết Nối`.

---

## 3. Cách Tải Ảnh & Thêm Dự Án Mới (Không Cần Code)

1. Trên trang Quản Trị, chuyển sang tab **"📸 Tải Ảnh Cloudinary & Thêm Mới"**.
2. Bấm vào nút lớn:
   > **📸 Mở Cloudinary Upload Widget (Không Cần Code)**
3. Cửa sổ Cloudinary sẽ hiện lên:
   - Bạn có thể **kéo thả ảnh**, chọn từ máy tính, mở máy ảnh điện thoại, hoặc dán link.
   - Cloudinary tự động nén dung lượng, đổi định dạng sang WebP/AVIF siêu nhẹ và trả về link ảnh CDN.
4. Điền các thông tin dự án:
   - **Tên công trình**: (Ví dụ: *Biệt Thự Vườn Ecopark*)
   - **Tiêu đề đầy đủ**: (Ví dụ: *Không Gian Bếp & Phòng Khách — Biệt Thự Ecopark*)
   - **Phân loại**: Chọn *Biệt Thự & Nhà Phố* / *Penthouse & Căn Hộ* / *Commercial & Showroom*.
   - **Năm hoàn thiện**: (Ví dụ: *2026*)
   - **Mô tả**: Vài dòng về vật liệu, ý tưởng thiết kế.
   - **Tùy chọn hiển thị**:
     - Tích chọn: `Hiển thị trên Slider Trang Chủ`
     - Tích chọn: `Hiển thị trong Thư Viện Công Trình`
5. Bấm nút **"💾 Lưu Công Trình Này"**.
   - Ngay lập tức ảnh mới sẽ xuất hiện trên Slider trang chủ và Thư viện công trình!

---

## 4. Quản Lý Danh Sách & Bật/Tắt Slider Nhanh

Trong tab **"📁 Danh Sách Công Trình & Slider"**:
- **Bật / Tắt ảnh trên Slider trang chủ**: Chỉ cần bấm vào nút `+ Thêm vào Slider` hoặc `✓ Đang trên Slider` trên từng thẻ dự án.
- **Chỉnh sửa**: Bấm biểu tượng cây bút `✏️` để sửa lại thông tin/thay ảnh.
- **Xóa dự án**: Bấm biểu tượng thùng rác `🗑️`.
- **Lọc danh sách**: Bấm xem riêng *Chỉ Slider*, *Biệt Thự*, *Penthouse*, v.v.

---

## 5. Sao Lưu & Đồng Bộ (Backup)

- **Xuất file JSON**: Trong tab Cài Đặt, bấm **"📥 Tải File JSON Dự Án Về Máy"** để lưu trữ một bản sao dự phòng của toàn bộ dự án.
- **Khôi phục gốc**: Nếu muốn quay về danh sách công trình mẫu ban đầu của Studio, bấm **"⚠️ Khôi Phục Dữ Liệu Gốc Ban Đầu"**.
