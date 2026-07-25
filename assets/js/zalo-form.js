// Zalo + Twilio API Consult Form Handler - Middleware xử lý form tư vấn chung
// LƯU Ý QUAN TRỌNG: Twilio YÊU CẦU backend để ẩn Account SID & Auth Token, không được để lộ thông tin này ở frontend
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo form cho trang chủ (id: zalo-consult-form)
  const mainForm = document.getElementById('zalo-consult-form');
  if (mainForm) {
    initForm(mainForm, 'form-success');
  }

  // Khởi tạo form cho trang liên hệ (id: zalo-consult-form-contact)
  const contactForm = document.getElementById('zalo-consult-form-contact');
  if (contactForm) {
    initForm(contactForm, 'form-success-contact');
  }

  // Hàm chung xử lý form (hỗ trợ cả Twilio API gửi SMS + mở Zalo)
  function initForm(formElement, successElementId) {
    formElement.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(formElement);
      const data = Object.fromEntries(formData);
      
      try {
        // === Bước 1: Gửi dữ liệu đến backend Node.js (backend sẽ gọi Twilio API) ===
        const response = await fetch('/api/send-consult-sms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ho_ten: data.ho_ten,
            so_dien_thoai_khach: data.so_dien_thoai,
            nhu_cau: data.nhu_cau
          })
        });

        if (response.ok) {
          // === Bước 2: Hiển thị thông báo thành công cho khách hàng ===
          const successElement = document.getElementById(successElementId);
          if (successElement) {
            successElement.textContent = "✅ Đã gửi thông tin thành công! Chúng tôi sẽ liên hệ lại sớm.";
            successElement.style.display = 'block';
            formElement.reset();
            setTimeout(() => { successElement.style.display = 'none'; }, 5000);
          }

          // === Bước 3: Vẫn mở Zalo để khách có thể chủ động nhắn tin ===
          const ZALO_PHONE = '0335818138';
          const zaloMessage = encodeURIComponent(
            `👋 Xin chào Nội Thất Anh Chi! Tôi là ${data.ho_ten || 'khách hàng'} - SĐT: ${data.so_dien_thoai || ''}.\nNhu cầu: ${data.nhu_cau || 'Tôi muốn tư vấn về nội thất.'}`
          );
          window.open(`https://zalo.me/${ZALO_PHONE}?text=${zaloMessage}`, '_blank');
        } else {
          throw new Error('Gửi SMS thất bại');
        }
      } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra! Vui lòng liên hệ trực tiếp qua Zalo: 0335818138');
      }
    });
  }
});