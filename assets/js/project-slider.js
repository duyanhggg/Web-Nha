/**
 * Studio Ashby & Architectural Digest Inspired Showcase Slider
 * Tự động chuyển đổi mượt mà giữa các bức ảnh dự án,
 * cập nhật tiêu đề / vị trí và hỗ trợ vuốt chạm, nút bấm, dots.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const previousButton = slider.querySelector('.prev-btn');
    const nextButton = slider.querySelector('.next-btn');
    const dotsContainer = slider.querySelector('.slider-dots');

    const titleNode = slider.querySelector('.showcase-title, .slider-title');
    const locationNode = slider.querySelector('.showcase-location, .slider-category');

    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    // Tạo các chấm chỉ số (dots)
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Chuyển tới ảnh ${idx + 1}`);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          showSlide(idx);
          startAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    function showSlide(index) {
      currentSlide = (index + slides.length) % slides.length;
      const targetSlide = slides[currentSlide];

      // Đổi class active cho slide ảnh
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
      });

      // Cập nhật text chú thích mượt mà
      if (targetSlide) {
        const newTitle = targetSlide.getAttribute('data-title');
        const newLoc = targetSlide.getAttribute('data-location') || targetSlide.getAttribute('data-category');

        if (titleNode && newTitle && titleNode.textContent !== newTitle) {
          titleNode.style.opacity = '0';
          setTimeout(() => {
            titleNode.textContent = newTitle;
            titleNode.style.opacity = '1';
          }, 160);
        }

        if (locationNode && newLoc && locationNode.textContent !== newLoc) {
          locationNode.style.opacity = '0';
          setTimeout(() => {
            locationNode.textContent = newLoc;
            locationNode.style.opacity = '1';
          }, 160);
        }
      }

      // Cập nhật trạng thái dots
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, dIdx) => {
          dot.classList.toggle('active', dIdx === currentSlide);
        });
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      // Tự động chuyển sau mỗi 4.5 giây
      timer = window.setInterval(() => showSlide(currentSlide + 1), 4500);
    }

    function stopAutoPlay() {
      if (timer) clearInterval(timer);
    }

    previousButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide - 1);
      startAutoPlay();
    });

    nextButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      showSlide(currentSlide + 1);
      startAutoPlay();
    });

    // Hỗ trợ vuốt chạm trên di động
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          showSlide(currentSlide + 1);
        } else {
          showSlide(currentSlide - 1);
        }
        startAutoPlay();
      }
    }

    // Tạm dừng khi rê chuột và tiếp tục khi rời chuột
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    // Bắt đầu hiển thị slide đầu tiên và kích hoạt autoplay
    showSlide(0);
    startAutoPlay();
  });
});
