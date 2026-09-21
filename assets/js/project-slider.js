/**
 * Studio Ashby Inspired Project Slider
 * Smooth transitions, autoplay, dots indicators, swipe & hover pause
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const previousButton = slider.querySelector('.prev-btn');
    const nextButton = slider.querySelector('.next-btn');
    const dotsContainer = slider.querySelector('.slider-dots');

    if (!slides.length) return;

    let currentSlide = 0;
    let timer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    // Create dots if container exists
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
      slides.forEach((slide, slideIndex) => {
        if (slideIndex === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update dots state
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, dIdx) => {
          dot.classList.toggle('active', dIdx === currentSlide);
        });
      }
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = window.setInterval(() => showSlide(currentSlide + 1), 5000);
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

    // Touch Swipe Support
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          showSlide(currentSlide + 1);
        } else {
          showSlide(currentSlide - 1);
        }
        startAutoPlay();
      }
    }

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  });
});
