# Cấu trúc theo chức năng

## Giao diện

- `index.html`: trang chủ, dự án nổi bật và slider ảnh động.
- `pages/`: mỗi file là một trang nội dung độc lập (`story`, `services`, `projects`, `process`, `testimonials`, `news`, `contact`, `thanks`, `admin`).
- `pages/admin.html`: Trang quản trị bảo mật (PIN), tích hợp Cloudinary Upload Widget để tải ảnh/video không cần code.
- `assets/css/styles.css`: kiểu dáng dùng chung, responsive, slider và nút Zalo.
- `assets/js/main.js`: tương tác menu, lightbox ảnh, bộ lọc portfolio, thanh tiến trình đọc và nút cuộn.
- `assets/js/projects-store.js`: trung tâm quản lý dữ liệu công trình, đồng bộ Cloudinary và tự động render Slider/Thư viện.
- `assets/js/zalo-form.js`: khởi tạo hành vi phía trình duyệt cho nút Zalo (mở tab Zalo trực tiếp, copy thông tin vào clipboard và chuyển hướng trang cảm ơn).
- `assets/js/project-slider.js`: điều khiển ảnh dự án nổi bật trên trang chủ (autoplay, dots, vuốt chạm).
- `assets/images/`: ảnh, video, favicon và ảnh chia sẻ mạng xã hội.
- `data/projects.json`: cơ sở dữ liệu danh sách công trình và slider hiển thị.

## Máy chủ

- `server.js`: khởi động Express, phục vụ file tĩnh, API `/api/projects`, `robots.txt` và `sitemap.xml`.

## Tài liệu & Hướng dẫn

- `docs/CLOUDINARY_GUIDE.md`: hướng dẫn chi tiết tải ảnh qua Cloudinary không cần code và quản lý slider.
- `docs/STRUCTURE.md`: cấu trúc dự án.

## Cấu hình

- `.env`: biến môi trường cục bộ (cổng PORT).
- `.env.example`: mẫu biến môi trường.
- `config/robots.txt` và `config/sitemap.xml`: cấu hình SEO.
- `package.json`: scripts và dependencies của Node.js.
