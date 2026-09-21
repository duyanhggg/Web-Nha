# Cấu trúc theo chức năng

## Giao diện

- `index.html`: trang chủ, dự án nổi bật và slider ảnh.
- `pages/`: mỗi file là một trang nội dung độc lập (`story`, `services`, `projects`, `process`, `testimonials`, `news`, `contact`, `thanks`).
- `assets/css/styles.css`: kiểu dáng dùng chung, responsive, slider và nút Zalo.
- `assets/js/main.js`: tương tác menu, lightbox ảnh, bộ lọc portfolio, thanh tiến trình đọc và nút cuộn.
- `assets/js/zalo-form.js`: khởi tạo hành vi phía trình duyệt cho nút Zalo (mở tab Zalo trực tiếp, copy thông tin vào clipboard và chuyển hướng trang cảm ơn).
- `assets/js/project-slider.js`: điều khiển ảnh dự án nổi bật trên trang chủ (autoplay, dots, vuốt chạm).
- `assets/images/`: ảnh, video, favicon và ảnh chia sẻ mạng xã hội.

## Máy chủ

- `server.js`: khởi động Express, phục vụ file tĩnh, `robots.txt` và `sitemap.xml`.

## Cấu hình

- `.env`: biến môi trường cục bộ (cổng PORT).
- `.env.example`: mẫu biến môi trường.
- `config/robots.txt` và `config/sitemap.xml`: cấu hình SEO.
- `package.json`: scripts và dependencies của Node.js.
