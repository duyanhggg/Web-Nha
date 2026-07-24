// Zalo Consult Form Handler - Middleware xử lý form tư vấn chung
document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo form cho trang chủ (id: zalo-consult-form)
  const mainForm = document.getElementById('zalo-consult-form');
  if (mainForm) {
    initZaloForm(mainForm, 'form-success');
  }

  // Khởi tạo form cho trang liên hệ (id: zalo-consult-form-contact)
  const contactForm = document.getElementById('zalo-consult-form-contact');
  if (contactForm) {
    initZaloForm(contactForm, 'form-success-contact');
  }

  // Hàm chung khởi tạo form Zalo
  function initZaloForm(formElement, successElementId) {
    formElement.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(formElement);
      const data = Object.fromEntries(formData);
      
      // Số điện thoại Zalo của bạn
      const ZALO_PHONE = '0335818138';
      
      // Tạo nội dung tin nhắn tự động
      const message = encodeURIComponent(
        `👋 Xin chào Nội Thất Anh Chi! Tôi là ${data.ho_ten || 'khách hàng'} - SĐT: ${data.so_dien_thoai || ''}.\nNhu cầu: ${data.nhu_cau || 'Tôi muốn tư vấn về nội thất.'}`
      );
      
      // Mở chat Zalo
      window.open(`https://zalo.me/${ZALO_PHONE}?text=${message}`, '_blank');
      
      // Hiển thị thông báo thành công
      const successElement = document.getElementById(successElementId);
      if (successElement) {
        successElement.style.display = 'block';
        formElement.reset();
        
        // Ẩn thông báo sau 5s
        setTimeout(() => {
          successElement.style.display = 'none';
        }, 5000);
      }
    });
  }
});