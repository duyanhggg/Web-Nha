/**
 * AnhChiNoiThat - Ultra-Luxury Single Page Application (SPA) Router
 * 
 * Features:
 * - Seamless client-side navigation without full-page reloads
 * - Sleek Studio Ashby Burnished Gold progress indicator
 * - Smooth hardware-accelerated exit & entry transitions
 * - Dynamic Title, Meta description & Topbar badge synchronization
 * - In-memory page caching & smart hover/touch preloading (<10ms instant load)
 * - Automatic URL & relative asset normalization
 * - Full HTML5 History API (pushState & popstate) support
 * - Clean lifecycle hooks for re-initializing components (sliders, lightbox, forms, filters)
 */

(function () {
  'use strict';

  // Do not initialize on file:// protocol as fetch is blocked by browser CORS
  if (window.location.protocol === 'file:') {
    console.info('AnhChiNoiThat SPA: File protocol detected. SPA router operating in standard MPA fallback mode.');
    return;
  }

  // --- Configuration & State ---
  const pageCache = new Map();
  let isNavigating = false;
  let progressBar = null;
  let progressTimer = null;

  // --- Progress Bar Control ---
  function getOrCreateProgressBar() {
    if (!progressBar) {
      progressBar = document.getElementById('spa-progress-bar');
      if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'spa-progress-bar';
        document.body.appendChild(progressBar);
      }
    }
    return progressBar;
  }

  function startProgress() {
    const bar = getOrCreateProgressBar();
    if (progressTimer) clearInterval(progressTimer);

    bar.classList.remove('is-finishing');
    bar.classList.add('is-loading');
    bar.style.width = '0%';
    bar.style.opacity = '1';

    let currentWidth = 15;
    bar.style.width = `${currentWidth}%`;

    progressTimer = setInterval(() => {
      if (currentWidth < 80) {
        currentWidth += Math.random() * 15;
        bar.style.width = `${Math.min(currentWidth, 85)}%`;
      }
    }, 120);
  }

  function finishProgress() {
    const bar = getOrCreateProgressBar();
    if (progressTimer) clearInterval(progressTimer);

    bar.classList.add('is-finishing');
    bar.style.width = '100%';

    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.classList.remove('is-loading', 'is-finishing');
        bar.style.width = '0%';
      }, 250);
    }, 180);
  }

  // --- Link & Asset Normalization ---
  function normalizePersistentLinks() {
    const base = window.location.href;
    const links = document.querySelectorAll('.header-nav-wrapper a, .mobile-nav-drawer a, .footer a');

    links.forEach(a => {
      const rawHref = a.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('http') || rawHref.startsWith('javascript:')) {
        return;
      }
      try {
        const resolved = new URL(rawHref, base);
        a.setAttribute('href', resolved.pathname);
      } catch (e) {
        // Keep original if invalid
      }
    });
  }

  // --- Page Extraction & Normalization ---
  function extractPageData(htmlString, targetUrl) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const spaContent = doc.querySelector('#spa-content');
    if (!spaContent) return null;

    const base = new URL(targetUrl, window.location.href);

    // Normalize relative asset paths inside the dynamic content
    spaContent.querySelectorAll('img, video, source').forEach(el => {
      ['src', 'poster', 'data-video'].forEach(attr => {
        const val = el.getAttribute(attr);
        if (val && !val.startsWith('data:') && !val.startsWith('http://') && !val.startsWith('https://') && !val.startsWith('//')) {
          try {
            el.setAttribute(attr, new URL(val, base).pathname);
          } catch (e) {}
        }
      });
    });

    // Normalize internal navigation links inside the dynamic content
    spaContent.querySelectorAll('a[href]').forEach(a => {
      const val = a.getAttribute('href');
      if (val && !val.startsWith('#') && !val.startsWith('tel:') && !val.startsWith('mailto:') && !val.startsWith('http') && !val.startsWith('javascript:')) {
        try {
          a.setAttribute('href', new URL(val, base).pathname);
        } catch (e) {}
      }
    });

    const title = doc.querySelector('title')?.innerText || document.title;
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content');
    const topbarBadgeText = doc.querySelector('.topbar-badge span:last-child')?.textContent?.trim();
    const isHeroNav = !!doc.querySelector('.header-nav-wrapper.hero-nav');

    return {
      title,
      metaDesc,
      topbarBadgeText,
      isHeroNav,
      contentHtml: spaContent.innerHTML
    };
  }

  // --- In-Memory Caching & Preloading ---
  function getCacheKey(url) {
    const parsed = new URL(url, window.location.href);
    return parsed.pathname;
  }

  function cacheInitialPage() {
    const spaContent = document.getElementById('spa-content');
    if (!spaContent) return;

    const key = getCacheKey(window.location.href);
    pageCache.set(key, {
      title: document.title,
      metaDesc: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      topbarBadgeText: document.querySelector('.topbar-badge span:last-child')?.textContent?.trim(),
      isHeroNav: document.querySelector('.header-nav-wrapper')?.classList.contains('hero-nav'),
      contentHtml: spaContent.innerHTML
    });
  }

  async function preloadPage(url) {
    try {
      const target = new URL(url, window.location.href);
      if (target.origin !== window.location.origin) return;

      const key = getCacheKey(target.href);
      if (pageCache.has(key)) return;

      const response = await fetch(target.href, {
        headers: { 'X-Requested-With': 'AnhChiNoiThat-SPA' }
      });
      if (!response.ok) return;

      const html = await response.text();
      const data = extractPageData(html, target.href);
      if (data) {
        pageCache.set(key, data);
      }
    } catch (e) {
      // Ignore background preload failures
    }
  }

  // --- SPA Navigation Execution ---
  async function navigate(targetUrl, { pushHistory = true } = {}) {
    const targetObj = new URL(targetUrl, window.location.href);
    const currentObj = new URL(window.location.href);

    // If navigating to identical path & query
    if (targetObj.pathname === currentObj.pathname && targetObj.search === currentObj.search) {
      if (targetObj.hash) {
        const targetEl = document.querySelector(targetObj.hash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (isNavigating) return;
    isNavigating = true;

    const spaContainer = document.getElementById('spa-content');
    if (!spaContainer) {
      window.location.href = targetUrl;
      return;
    }

    startProgress();

    // Trigger subtle exit transition
    spaContainer.classList.add('is-exiting');

    try {
      const key = getCacheKey(targetObj.href);
      let pageData = pageCache.get(key);

      if (!pageData) {
        const response = await fetch(targetObj.href, {
          headers: { 'X-Requested-With': 'AnhChiNoiThat-SPA' }
        });

        if (!response.ok) {
          window.location.href = targetUrl;
          return;
        }

        const html = await response.text();
        pageData = extractPageData(html, targetObj.href);
        if (!pageData) {
          window.location.href = targetUrl;
          return;
        }
        pageCache.set(key, pageData);
      }

      // Allow 120ms exit transition to render smoothly
      await new Promise(resolve => setTimeout(resolve, 120));

      // Push history state if required
      if (pushHistory) {
        history.pushState(null, '', targetObj.href);
      }

      // Update document title
      if (pageData.title) {
        document.title = pageData.title;
      }

      // Update meta description
      if (pageData.metaDesc) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', pageData.metaDesc);
      }

      // Update Topbar badge text with micro-fade
      if (pageData.topbarBadgeText) {
        const badgeNode = document.querySelector('.topbar-badge span:last-child');
        if (badgeNode && badgeNode.textContent.trim() !== pageData.topbarBadgeText) {
          badgeNode.style.opacity = '0';
          setTimeout(() => {
            badgeNode.textContent = pageData.topbarBadgeText;
            badgeNode.style.opacity = '1';
          }, 120);
        }
      }

      // Toggle Header Nav mode (hero-nav vs inner-page-nav)
      const headerWrapper = document.querySelector('.header-nav-wrapper');
      if (headerWrapper) {
        if (pageData.isHeroNav) {
          headerWrapper.classList.add('hero-nav');
          headerWrapper.classList.remove('inner-page-nav');
        } else {
          headerWrapper.classList.remove('hero-nav');
          headerWrapper.classList.add('inner-page-nav');
        }
      }

      // Swap dynamic content
      spaContainer.innerHTML = pageData.contentHtml;

      // Scroll immediately to top for natural reading position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // Trigger enter transition
      spaContainer.classList.remove('is-exiting');
      spaContainer.classList.add('is-entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          spaContainer.classList.remove('is-entering');
        });
      });

      finishProgress();

      // Close mobile menu drawer if open
      if (typeof window.closeMobileMenu === 'function') {
        window.closeMobileMenu();
      }

      // Re-initialize dynamic components & event listeners
      if (typeof window.initActiveNavLink === 'function') {
        window.initActiveNavLink(targetObj.href);
      }
      if (typeof window.initPortfolioFilter === 'function') {
        window.initPortfolioFilter();
      }
      if (typeof window.initScrollAnimations === 'function') {
        window.initScrollAnimations();
      }
      if (typeof window.initSmoothScroll === 'function') {
        window.initSmoothScroll();
      }
      if (typeof window.initCounterAnimations === 'function') {
        window.initCounterAnimations();
      }
      if (typeof window.initLightboxModal === 'function') {
        window.initLightboxModal();
      }
      if (typeof window.initProjectSliders === 'function') {
        window.initProjectSliders();
      }
      if (typeof window.initZaloForms === 'function') {
        window.initZaloForms();
      }

      // Dispatch global custom event for any external listeners
      document.dispatchEvent(new CustomEvent('spa:navigated', {
        detail: {
          url: targetObj.href,
          pathname: targetObj.pathname,
          title: pageData.title
        }
      }));

    } catch (err) {
      console.error('SPA navigation error, falling back to full reload:', err);
      window.location.href = targetUrl;
    } finally {
      isNavigating = false;
    }
  }

  // --- Event Listeners ---
  function initLinkInterceptors() {
    // Click delegation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref) return;

      // Ignore default prevented or non-primary clicks
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      // Ignore external target or downloads
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;
      if (link.getAttribute('data-no-spa') !== null) return;

      // Ignore protocols & in-page anchors
      if (rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('javascript:')) return;
      if (rawHref.startsWith('#')) return;

      try {
        const targetUrl = new URL(rawHref, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;

        e.preventDefault();
        navigate(targetUrl.href);
      } catch (err) {
        // Let standard link click proceed
      }
    });

    // Hover & Touch preloading for lightning-fast transitions
    const handlePreload = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const rawHref = link.getAttribute('href');
      if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('tel:') || rawHref.startsWith('mailto:') || rawHref.startsWith('javascript:')) {
        return;
      }

      try {
        const targetUrl = new URL(rawHref, window.location.href);
        if (targetUrl.origin === window.location.origin) {
          preloadPage(targetUrl.href);
        }
      } catch (err) {}
    };

    document.addEventListener('mouseover', handlePreload, { passive: true });
    document.addEventListener('touchstart', handlePreload, { passive: true });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      navigate(window.location.href, { pushHistory: false });
    });
  }

  // --- Bootstrapping ---
  function initSPA() {
    normalizePersistentLinks();
    cacheInitialPage();
    initLinkInterceptors();

    // Initial highlight of active nav link
    if (typeof window.initActiveNavLink === 'function') {
      window.initActiveNavLink();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSPA);
  } else {
    initSPA();
  }

  // --- Public API ---
  window.spaNavigate = (url) => navigate(url);
  window.spaPreload = (url) => preloadPage(url);

})();
