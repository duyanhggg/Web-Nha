/**
 * AnhChiNoiThat - Interactive Main Script
 * Ultra-Luxury Editorial Architecture & Interior Design
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initPortfolioFilter();
  initScrollAnimations();
  initSmoothScroll();
  initScrollProgressBar();
  initBackToTop();
  initCounterAnimations();
  initLightboxModal();
  initActiveNavLink();
});

// Header scroll state handling
function initHeaderScroll() {
  const header = document.querySelector('.header-nav-wrapper');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// Active Nav Link highlight based on current page
function initActiveNavLink(customUrl) {
  const currentPath = customUrl ? new URL(customUrl, window.location.href).pathname : window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

  navLinks.forEach(link => {
    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('http') || rawHref.startsWith('#')) return;

    try {
      const linkPath = new URL(rawHref, window.location.href).pathname;
      const isCurrentHome = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('index.html');
      const isLinkHome = linkPath === '/' || linkPath.endsWith('/index.html') || linkPath.endsWith('index.html');

      if (isCurrentHome && isLinkHome) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else if (!isLinkHome && (currentPath === linkPath || currentPath.endsWith(linkPath) || linkPath.endsWith(currentPath))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    } catch (e) {}
  });
}

// Scroll Progress Indicator Bar
function initScrollProgressBar() {
  let progressContainer = document.querySelector('.scroll-progress-bar');
  if (!progressContainer) {
    progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress-bar';
    document.body.appendChild(progressContainer);
  }

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    const progress = (scrollTop / docHeight) * 100;
    progressContainer.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// Back to Top Button
function initBackToTop() {
  let backToTopBtn = document.querySelector('.back-to-top-btn');
  if (!backToTopBtn) {
    const actionsContainer = document.querySelector('.floating-quick-actions');
    if (actionsContainer) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.className = 'back-to-top-btn';
      backToTopBtn.setAttribute('aria-label', 'Cuộn lên đầu trang');
      backToTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      `;
      actionsContainer.appendChild(backToTopBtn);
    }
  }

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Mobile Menu Drawer
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const closeBtn = document.querySelector('.mobile-nav-close');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  }

  toggleBtn.addEventListener('click', () => {
    if (drawer.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  window.closeMobileMenu = closeMenu;

  // Close menu when clicking links
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// Portfolio Filter Switching
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category], .featured-project-item[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = '';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Intersection Observer for Fade-in Animations
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');
  if (!animatedElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Counter animation for stat cards
function initCounterAnimations() {
  const statElements = document.querySelectorAll('.hero-stat-card strong, .stat-number');
  if (!statElements.length) return;

  const animateCount = (el) => {
    const rawText = el.innerText.trim();
    const targetMatch = rawText.match(/\d+/);
    if (!targetMatch) return;

    const targetNum = parseInt(targetMatch[0], 10);
    const suffix = rawText.replace(targetMatch[0], '');
    let count = 0;
    const duration = 1800; // ms
    const stepTime = Math.max(10, Math.floor(duration / targetNum));

    const timer = setInterval(() => {
      count += 1;
      el.innerText = `${count}${suffix}`;
      if (count >= targetNum) {
        el.innerText = rawText;
        clearInterval(timer);
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statElements.forEach(el => observer.observe(el));
}

// Lightbox Modal for Project Image Previews
function initLightboxModal() {
  let lightboxModal = document.querySelector('.lightbox-modal');
  if (!lightboxModal) {
    lightboxModal = document.createElement('div');
    lightboxModal.className = 'lightbox-modal';
    lightboxModal.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close-btn" aria-label="Đóng">&times;</button>
        <div class="lightbox-img-wrapper">
          <img src="" alt="AnhChiNoiThat Preview" id="lightbox-img">
          <video controls playsinline id="lightbox-video" style="display:none; max-width:100%; max-height:80vh; border-radius:8px; outline:none; background:#000;"></video>
        </div>
        <h3 class="lightbox-caption" id="lightbox-caption"></h3>
        <p class="lightbox-subtitle" id="lightbox-subtitle"></p>
      </div>
    `;
    document.body.appendChild(lightboxModal);
  }

  const closeBtn = lightboxModal.querySelector('.lightbox-close-btn');
  const imgEl = lightboxModal.querySelector('#lightbox-img');
  const videoEl = lightboxModal.querySelector('#lightbox-video');
  const captionEl = lightboxModal.querySelector('#lightbox-caption');
  const subtitleEl = lightboxModal.querySelector('#lightbox-subtitle');

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-active');
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
      videoEl.src = '';
      videoEl.style.display = 'none';
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('is-active')) {
      closeLightbox();
    }
  });

  // Attach click listener to project card images and videos
  const clickableElements = document.querySelectorAll('.project-card img, .slide img, .featured-slide-card img, .project-card video, .slide video, .open-video-btn');
  clickableElements.forEach(el => {
    if (el.dataset.lightboxBound === 'true') return;
    el.dataset.lightboxBound = 'true';

    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = el.closest('.project-card, .slide, .featured-slide-card') || el;
      let titleText = el.getAttribute('alt') || 'AnhChiNoiThat';
      let subText = 'Công Trình Thực Tế';

      if (parentCard) {
        const titleNode = parentCard.querySelector('h3, .slide-title, h4');
        const tagNode = parentCard.querySelector('.project-category, .eyebrow, .slide-tag, .project-meta');
        if (parentCard.getAttribute('data-title')) {
          titleText = parentCard.getAttribute('data-title');
        } else if (titleNode) {
          titleText = titleNode.innerText.trim();
        }

        if (parentCard.getAttribute('data-location')) {
          subText = parentCard.getAttribute('data-location');
        } else if (tagNode) {
          const spans = tagNode.querySelectorAll('span');
          if (spans.length > 0) {
            subText = Array.from(spans).map(s => s.innerText.trim()).filter(Boolean).join(' • ');
          } else {
            subText = tagNode.innerText.trim();
          }
        }
      }

      const videoSrc = el.getAttribute('data-video') || (el.tagName === 'VIDEO' ? (el.currentSrc || el.querySelector('source')?.src || el.src) : null);

      if (videoSrc) {
        imgEl.style.display = 'none';
        videoEl.style.display = 'block';
        videoEl.src = videoSrc;
        videoEl.play().catch(() => {});
      } else {
        if (videoEl) {
          videoEl.pause();
          videoEl.style.display = 'none';
          videoEl.src = '';
        }
        imgEl.style.display = 'block';
        imgEl.src = el.src;
        imgEl.alt = titleText;
      }

      captionEl.innerText = titleText;
      subtitleEl.innerText = subText;
      lightboxModal.classList.add('is-active');
    });
  });

  // Hover video playback on cards
  document.querySelectorAll('.project-card-video').forEach(card => {
    if (card.dataset.videoHoverBound === 'true') return;
    card.dataset.videoHoverBound = 'true';

    const vid = card.querySelector('video');
    if (!vid) return;
    card.addEventListener('mouseenter', () => {
      vid.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      vid.pause();
    });
  });
}

// Expose on window for SPA router re-initialization
window.initActiveNavLink = initActiveNavLink;
window.initPortfolioFilter = initPortfolioFilter;
window.initScrollAnimations = initScrollAnimations;
window.initSmoothScroll = initSmoothScroll;
window.initCounterAnimations = initCounterAnimations;
window.initLightboxModal = initLightboxModal;


