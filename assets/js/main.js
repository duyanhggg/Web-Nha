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
function initActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('index.html')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
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
        </div>
        <h3 class="lightbox-caption" id="lightbox-caption"></h3>
        <p class="lightbox-subtitle" id="lightbox-subtitle"></p>
      </div>
    `;
    document.body.appendChild(lightboxModal);
  }

  const closeBtn = lightboxModal.querySelector('.lightbox-close-btn');
  const imgEl = lightboxModal.querySelector('#lightbox-img');
  const captionEl = lightboxModal.querySelector('#lightbox-caption');
  const subtitleEl = lightboxModal.querySelector('#lightbox-subtitle');

  const closeLightbox = () => {
    lightboxModal.classList.remove('is-active');
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

  // Attach click listener to project card images
  const clickableImages = document.querySelectorAll('.project-card img, .slide img, .featured-slide-card img');
  clickableImages.forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.preventDefault();
      const parentCard = img.closest('.project-card, .slide, .featured-slide-card');
      let titleText = img.alt || 'AnhChiNoiThat';
      let subText = 'Công Trình Cao Cấp';

      if (parentCard) {
        const titleNode = parentCard.querySelector('h3, .slide-title, h4');
        const tagNode = parentCard.querySelector('.project-category, .eyebrow, .slide-tag');
        if (titleNode) titleText = titleNode.innerText.trim();
        if (tagNode) subText = tagNode.innerText.trim();
      }

      imgEl.src = img.src;
      imgEl.alt = titleText;
      captionEl.innerText = titleText;
      subtitleEl.innerText = subText;
      lightboxModal.classList.add('is-active');
    });
  });
}

