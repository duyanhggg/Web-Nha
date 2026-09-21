/**
 * Xử lý gửi Form tư vấn trực tiếp qua Zalo (Option 1)
 * Zalo Hotline / Zalo Me: 0335818138 (AnhChiNoiThat)
 */
document.addEventListener('DOMContentLoaded', function() {
  const ZALO_PHONE = '0335818138';
  const forms = document.querySelectorAll('.luxury-form');

  if (!forms.length) return;

  const projectTypeLabels = {
    'biet-thu': 'Biệt thự / Villa',
    'penthouse': 'Penthouse / Căn hộ cao cấp',
    'nha-pho': 'Nhà phố / Lô góc',
    'commercial': 'Showroom / Văn phòng'
  };

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nameInput = form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]');
      const typeSelect = form.querySelector('[name="project_type"]');
      const msgInput = form.querySelector('[name="message"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const rawType = typeSelect ? typeSelect.value : '';
      const projectType = projectTypeLabels[rawType] || rawType || 'Tư vấn nội thất';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !phone) {
        alert('Vui lòng điền đầy đủ Họ tên và Số điện thoại!');
        return;
      }

      // Tạo nội dung tin nhắn tư vấn gửi Zalo
      let zaloText = `Xin chào AnhChiNoiThat!\nTôi muốn nhận tư vấn không gian nội thất:\n`;
      zaloText += `- Họ và tên: ${name}\n`;
      zaloText += `- Số điện thoại: ${phone}\n`;
      if (projectType) zaloText += `- Loại công trình: ${projectType}\n`;
      if (message) zaloText += `- Lời nhắn: ${message}\n`;

      // 1. Mở Zalo Chat trong tab mới NGAY LẬP TỨC (đồng bộ) để không bị trình duyệt chặn popup
      window.open(`https://zalo.me/${ZALO_PHONE}`, '_blank');

      // 2. Copy tự động nội dung thông tin tư vấn vào clipboard của khách
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(zaloText).catch(err => {
          console.warn('Không thể copy tự động:', err);
        });
      }

      // 3. Đổi trạng thái nút bấm gửi
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '⏳ Đang chuyển tiếp sang trang cảm ơn...';
        submitBtn.disabled = true;
      }

      // 4. Chuyển hướng tab hiện tại đến trang thanks.html
      const isSubFolder = window.location.pathname.includes('/pages/');
      const thanksPath = isSubFolder ? 'thanks.html' : 'pages/thanks.html';

      setTimeout(() => {
        window.location.href = thanksPath;
      }, 500);
    });
  });
});