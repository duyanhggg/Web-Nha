/**
 * Studio Ashby & Architectural Digest Inspired Project Slider
 * Cinematic cross-fade transitions, dynamic editorial metadata,
 * touch swipe, counters, dots and autoplay with pause on hover.
 */

document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const previousButton = slider.querySelector('.prev-btn');
    const nextButton = slider.querySelector('.next-btn');
    const dotsContainer = slider.querySelector('.slider-dots');

    // Dynamic editorial content nodes
    const categoryNode = slider.querySelector('.slider-category');
    const titleNode = slider.querySelector('.slider-title');
    const descNode = slider.querySelector('.slider-description');
    const currentNumNode = slider.querySelector('.current-slide-num');
    const totalNumNode = slider.querySelector('.total-slide-num');

    if (!slides.length) return;

    if (totalNumNode) {
      totalNumNode.textContent = String(slides.length).padStart(2, '0');
    }

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
        dot.setAttribute('aria-label', `Chuyển tới công trình ${idx + 1}`);
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

      // Update active slide class
      slides.forEach((slide, slideIndex) => {
        if (slideIndex === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      // Update editorial text content with subtle cross-fade
      if (targetSlide) {
        const newCat = targetSlide.getAttribute('data-category');
        const newTitle = targetSlide.getAttribute('data-title');
        const newDesc = targetSlide.getAttribute('data-desc');

        if (categoryNode && newCat) {
          categoryNode.textContent = newCat;
        }

        if (titleNode && newTitle && titleNode.textContent !== newTitle) {
          titleNode.style.opacity = '0';
          titleNode.style.transform = 'translateY(6px)';
          setTimeout(() => {
            titleNode.textContent = newTitle;
            titleNode.style.opacity = '1';
            titleNode.style.transform = 'translateY(0)';
          }, 180);
        }

        if (descNode && newDesc && descNode.textContent !== newDesc) {
          descNode.style.opacity = '0';
          descNode.style.transform = 'translateY(6px)';
          setTimeout(() => {
            descNode.textContent = newDesc;
            descNode.style.opacity = '1';
            descNode.style.transform = 'translateY(0)';
          }, 220);
        }
      }

      // Update slide counter
      if (currentNumNode) {
        currentNumNode.textContent = String(currentSlide + 1).padStart(2, '0');
      }

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
      timer = window.setInterval(() => showSlide(currentSlide + 1), 6000);
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

    // Touch Swipe Support for Mobile
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

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);

    showSlide(0);
    startAutoPlay();
  });
});
