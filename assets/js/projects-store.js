/**
 * AnhChiNoiThat - Central Projects & Cloudinary Data Store
 * Tự động quản lý danh sách công trình, slider và tích hợp đồng bộ Cloudinary
 */

(function () {
  'use strict';

  const STORAGE_KEY_PROJECTS = 'acnt_projects_data';
  const STORAGE_KEY_CLOUDINARY = 'acnt_cloudinary_config';

  // Cấu hình Cloudinary mặc định (Người dùng có thể đổi trong trang Admin)
  const DEFAULT_CLOUDINARY_CONFIG = {
    cloudName: '',
    uploadPreset: '',
    folder: 'anhchinoithat'
  };

  // Dữ liệu dự án mặc định nếu chưa có kết nối mạng hoặc local cache
  const DEFAULT_FALLBACK_PROJECTS = [
    {
      id: "mipec-long-bien",
      title: "Căn Hộ Mipec Long Biên",
      fullTitle: "Giường Tầng Đa Năng & Suite Master — CC Mipec Long Biên",
      category: "penthouse",
      categoryName: "Penthouse & Căn hộ",
      location: "Hà Nội • Suite Master & Giường Tầng",
      metaLocation: "PENTHOUSE • HÀ NỘI",
      year: "2026",
      description: "Giải pháp tối ưu diện tích cho không gian căn hộ gia đình nhỏ với thiết kế gỗ tự nhiên ấm áp.",
      imageUrl: "assets/images/0b22fe0d6c8fedd1b49e10.jpg",
      videoUrl: "",
      isVideo: false,
      badge: "",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 8,
      order: 1
    },
    {
      id: "biet-thu-anh-sang",
      title: "Biệt Thự Ánh Sáng Tự Nhiên",
      fullTitle: "Biệt Thự Ánh Sáng Tự Nhiên",
      category: "villa",
      categoryName: "Biệt thự & Nhà phố",
      location: "Hà Nội • Gỗ Tự Nhiên & Kiến Trúc Xanh",
      metaLocation: "BIỆT THỰ • HÀ NỘI",
      year: "2025",
      description: "Ngôn ngữ vật liệu gỗ và đá tự nhiên kết nối hài hòa cùng ánh sáng mặt trời.",
      imageUrl: "assets/images/31f9d9d64b54ca0a93459.jpg",
      videoUrl: "",
      isVideo: false,
      badge: "",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 4,
      order: 2
    },
    {
      id: "showroom-bespoke",
      title: "Showroom Nghệ Thuật Bespoke",
      fullTitle: "Showroom Thương Hiệu Bespoke",
      category: "commercial",
      categoryName: "Commercial & Showroom",
      location: "Hà Nội • Không Gian Trưng Bày Độc Bản",
      metaLocation: "SHOWROOM • HÀ NỘI",
      year: "2025",
      description: "Bố cục không gian mở làm nổi bật các bộ sưu tập nội thất độc bản.",
      imageUrl: "assets/images/b18a22a2b020317e68316.jpg",
      videoUrl: "",
      isVideo: false,
      badge: "",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 4,
      order: 3
    },
    {
      id: "penthouse-toi-gian",
      title: "Penthouse Tối Giản Vĩnh Cửu",
      fullTitle: "Penthouse Tối Giản Vĩnh Cửu",
      category: "penthouse",
      categoryName: "Penthouse & Căn hộ",
      location: "Tiền Giang • Đá Marble & Đồng Thau",
      metaLocation: "CĂN HỘ CAO CẤP • TIỀN GIANG",
      year: "2026",
      description: "Đường nét tinh gọn, chú trọng tỉ lệ vàng và sự an yên trong nhịp sống đô thị.",
      imageUrl: "assets/images/ec666c49fecb7f9526da7.jpg",
      videoUrl: "",
      isVideo: false,
      badge: "",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 8,
      order: 4
    },
    {
      id: "nha-anh-doan-bep",
      title: "Không Gian Bếp Hiện Đại — Nhà Anh Đoàn",
      fullTitle: "Không Gian Bếp Hiện Đại & Tủ Bếp Acrylic — Nhà Anh Đoàn",
      category: "villa",
      categoryName: "Biệt thự & Nhà phố",
      location: "Chính Thuần, Lại Yên, Hà Nội • Tủ Bếp Acrylic Sang Trọng",
      metaLocation: "NHÀ PHỐ • CHÍNH THUẦN, LẠI YÊN, HÀ NỘI",
      year: "2026",
      description: "Hệ tủ bếp chữ L kịch trần bằng Acrylic bóng gương cao cấp, mặt đá đen kim sa sang trọng, kính ốp tường xanh ngọc dịu mát và tiện ích thông minh tối ưu cho gia đình.",
      imageUrl: "assets/images/nha-anh-doan-lai-yen-2.jpg",
      videoUrl: "",
      isVideo: false,
      badge: "📸 2 Góc Ảnh Hoàn Thiện",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 6,
      order: 5
    },
    {
      id: "nha-anh-doan-video",
      title: "Video Bàn Giao Thực Tế — Nhà Anh Đoàn",
      fullTitle: "Thước Phim Thực Tế Bàn Giao Bếp — Nhà Anh Đoàn",
      category: "villa",
      categoryName: "Biệt thự & Nhà phố",
      location: "Chính Thuần, Lại Yên, Hà Nội • Video Nghiệm Thu Chi Tiết",
      metaLocation: "VIDEO BÀN GIAO • LẠI YÊN, HÀ NỘI",
      year: "2026",
      description: "Video quay trực tiếp trải nghiệm đóng mở ray kéo giảm chấn, giá nâng hạ cánh lật và bề mặt bóng gương sang trọng sau khi lắp ráp hoàn thiện.",
      imageUrl: "assets/images/nha-anh-doan-lai-yen-1.jpg",
      videoUrl: "assets/images/nha-anh-doan-lai-yen-video.mp4",
      isVideo: true,
      badge: "🎬 Video Thực Tế",
      showOnSlider: true,
      showOnGallery: true,
      colSpan: 6,
      order: 6
    }
  ];

  class ProjectsStore {
    constructor() {
      this.projects = [];
      this.isLoaded = false;
      this.loadPromise = this.init();
    }

    // Lấy cấu hình Cloudinary
    getCloudinaryConfig() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CLOUDINARY);
        if (saved) {
          return { ...DEFAULT_CLOUDINARY_CONFIG, ...JSON.parse(saved) };
        }
      } catch (e) {
        console.warn('Lỗi đọc Cloudinary config:', e);
      }
      return { ...DEFAULT_CLOUDINARY_CONFIG };
    }

    // Lưu cấu hình Cloudinary
    setCloudinaryConfig(config) {
      try {
        const current = this.getCloudinaryConfig();
        const merged = { ...current, ...config };
        localStorage.setItem(STORAGE_KEY_CLOUDINARY, JSON.stringify(merged));
        return merged;
      } catch (e) {
        console.error('Lỗi lưu Cloudinary config:', e);
        return null;
      }
    }

    // Khởi tạo và nạp dữ liệu (Ưu tiên LocalStorage -> API / JSON -> Fallback)
    async init() {
      // 1. Kiểm tra cache trong localStorage
      try {
        const localData = localStorage.getItem(STORAGE_KEY_PROJECTS);
        if (localData) {
          const parsed = JSON.parse(localData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.projects = parsed;
            this.isLoaded = true;
          }
        }
      } catch (e) {
        console.warn('Lỗi parse local projects data:', e);
      }

      // 2. Nạp từ backend hoặc file tĩnh data/projects.json
      try {
        const isInPages = window.location.pathname.includes('/pages/') || 
                          window.location.pathname.endsWith('.html') && !window.location.pathname.endsWith('index.html');
        const jsonPath = isInPages ? '../data/projects.json' : 'data/projects.json';
        
        // Thử gọi /api/projects hoặc file json
        const res = await fetch(jsonPath, { cache: 'no-cache' }).catch(() => null);
        if (res && res.ok) {
          const serverData = await res.json();
          if (Array.isArray(serverData) && serverData.length > 0) {
            // Nếu local chưa có dữ liệu tùy chỉnh, dùng serverData
            if (!this.projects.length) {
              this.projects = serverData;
              localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(this.projects));
            }
          }
        }
      } catch (err) {
        console.warn('Không thể nạp projects từ JSON/API, sử dụng fallback:', err);
      }

      // 3. Nếu vẫn trống, nạp fallback mặc định
      if (!this.projects.length) {
        this.projects = [...DEFAULT_FALLBACK_PROJECTS];
        try {
          localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(this.projects));
        } catch (e) {}
      }

      this.isLoaded = true;
      return this.projects;
    }

    async getAll() {
      if (!this.isLoaded) {
        await this.loadPromise;
      }
      return [...this.projects];
    }

    async getById(id) {
      const all = await this.getAll();
      return all.find(p => p.id === id) || null;
    }

    async saveAll(newList) {
      this.projects = [...newList];
      try {
        localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(this.projects));
      } catch (e) {
        console.error('Lỗi lưu projects vào localStorage:', e);
      }

      // Cố gắng sync lên server Express nếu có endpoint /api/projects
      try {
        await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.projects)
        });
      } catch (e) {
        // Môi trường Vercel tĩnh hoặc offline không sao
      }

      // Dispatch event
      document.dispatchEvent(new CustomEvent('acnt:projects-updated', {
        detail: { projects: this.projects }
      }));

      return this.projects;
    }

    async addProject(project) {
      const all = await this.getAll();
      const newId = project.id || 'proj-' + Date.now();
      const newProject = {
        ...project,
        id: newId,
        order: all.length + 1,
        createdAt: new Date().toISOString()
      };
      all.unshift(newProject);
      await this.saveAll(all);
      return newProject;
    }

    async updateProject(id, updatedFields) {
      const all = await this.getAll();
      const index = all.findIndex(p => p.id === id);
      if (index === -1) return null;

      all[index] = { ...all[index], ...updatedFields };
      await this.saveAll(all);
      return all[index];
    }

    async deleteProject(id) {
      const all = await this.getAll();
      const filtered = all.filter(p => p.id !== id);
      await this.saveAll(filtered);
      return filtered;
    }

    async resetToDefault() {
      this.projects = [...DEFAULT_FALLBACK_PROJECTS];
      await this.saveAll(this.projects);
      return this.projects;
    }

    // Helper chuẩn hóa đường dẫn ảnh (cho tương thích trang con /pages/ vs trang chủ /)
    resolveAssetPath(url) {
      if (!url) return '';
      // Link tuyệt đối (Cloudinary, https://...) giữ nguyên
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('//')) {
        return url;
      }
      const isInPages = window.location.pathname.includes('/pages/') || 
                       (window.location.pathname.endsWith('.html') && !window.location.pathname.endsWith('index.html'));
      
      // Nếu đang ở /pages/ mà url bắt đầu bằng 'assets/' -> đổi thành '../assets/'
      if (isInPages && url.startsWith('assets/')) {
        return '../' + url;
      }
      // Nếu đang ở root mà url bắt đầu bằng '../assets/' -> đổi thành 'assets/'
      if (!isInPages && url.startsWith('../assets/')) {
        return url.replace('../assets/', 'assets/');
      }
      return url;
    }

    // Render danh sách ảnh Slider trên trang chủ
    async renderSlider(sliderSelector = '.single-showcase-slider') {
      const sliderEl = document.querySelector(sliderSelector);
      if (!sliderEl) return;

      const mediaContainer = sliderEl.querySelector('.slider-media');
      if (!mediaContainer) return;

      const projects = await this.getAll();
      const sliderProjects = projects.filter(p => p.showOnSlider !== false);

      if (!sliderProjects.length) return;

      // Xóa nội dung cũ
      mediaContainer.innerHTML = '';

      sliderProjects.forEach((proj, idx) => {
        const slide = document.createElement('div');
        slide.className = `slide ${idx === 0 ? 'active' : ''}`;
        slide.setAttribute('data-title', proj.title || proj.fullTitle);
        slide.setAttribute('data-location', proj.location || proj.metaLocation || 'AnhChiNoiThat');
        
        const resolvedImage = this.resolveAssetPath(proj.imageUrl);

        if (proj.isVideo && proj.videoUrl) {
          const resolvedVideo = this.resolveAssetPath(proj.videoUrl);
          slide.setAttribute('data-video', resolvedVideo);
          slide.innerHTML = `
            <video muted loop playsinline poster="${resolvedImage}">
              <source src="${resolvedVideo}" type="video/mp4" />
            </video>
            <div class="slide-video-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Video Thực Tế (Bấm để xem)</span>
            </div>
          `;
        } else {
          slide.innerHTML = `
            <img src="${resolvedImage}" alt="${proj.title || 'Dự án'} - AnhChiNoiThat" loading="${idx === 0 ? 'eager' : 'lazy'}" />
          `;
        }

        mediaContainer.appendChild(slide);
      });

      // Cập nhật thông tin chú thích slide đầu tiên
      const firstProj = sliderProjects[0];
      const titleNode = sliderEl.querySelector('.showcase-title, .slider-title');
      const locationNode = sliderEl.querySelector('.showcase-location, .slider-category');
      if (titleNode && firstProj) titleNode.textContent = firstProj.title || firstProj.fullTitle;
      if (locationNode && firstProj) locationNode.textContent = firstProj.location || firstProj.metaLocation || '';

      // Tái kích hoạt slider & lightbox
      if (typeof window.initProjectSliders === 'function') {
        window.initProjectSliders();
      }
      if (typeof window.initLightboxModal === 'function') {
        window.initLightboxModal();
      }
    }

    // Render danh sách công trình trên trang Thư Viện (pages/projects.html)
    async renderProjectsGrid(gridSelector = '.asymmetric-grid') {
      const gridEl = document.querySelector(gridSelector);
      if (!gridEl) return;

      const projects = await this.getAll();
      const galleryProjects = projects.filter(p => p.showOnGallery !== false);

      if (!galleryProjects.length) return;

      gridEl.innerHTML = '';

      galleryProjects.forEach((proj, index) => {
        const card = document.createElement('article');
        const colClass = `col-${proj.colSpan || (index % 3 === 0 ? 8 : 4)}`;
        const videoClass = proj.isVideo ? 'project-card-video' : '';
        card.className = `project-card ${colClass} ${videoClass}`.trim();
        card.setAttribute('data-category', proj.category || 'all');
        card.setAttribute('data-id', proj.id);

        const resolvedImage = this.resolveAssetPath(proj.imageUrl);
        let mediaHtml = '';

        if (proj.isVideo && proj.videoUrl) {
          const resolvedVideo = this.resolveAssetPath(proj.videoUrl);
          card.setAttribute('data-video', resolvedVideo);
          mediaHtml = `
            <div class="project-card-image">
              <video muted loop playsinline poster="${resolvedImage}">
                <source src="${resolvedVideo}" type="video/mp4" />
              </video>
              <div class="video-overlay-play">
                <div class="play-icon-circle">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
                <span>Xem Video Bàn Giao</span>
              </div>
              <span class="project-media-badge video-badge">🎬 Video Thực Tế</span>
            </div>
          `;
        } else {
          const badgeHtml = proj.badge ? `<span class="project-media-badge">${proj.badge}</span>` : '';
          mediaHtml = `
            <div class="project-card-image">
              <img src="${resolvedImage}" alt="${proj.title || 'Dự án'} - AnhChiNoiThat" loading="lazy" />
              ${badgeHtml}
            </div>
          `;
        }

        const metaLoc = proj.metaLocation || (proj.categoryName ? `${proj.categoryName.toUpperCase()}` : 'CÔNG TRÌNH');
        const metaYear = proj.year || '2026';

        card.innerHTML = `
          ${mediaHtml}
          <div class="project-card-body">
            <div class="project-meta">
              <span>${metaLoc}</span>
              <span>${metaYear}</span>
            </div>
            <h3>${proj.fullTitle || proj.title}</h3>
            <p>${proj.description || ''}</p>
          </div>
        `;

        gridEl.appendChild(card);
      });

      // Tái kích hoạt bộ lọc và lightbox
      if (typeof window.initPortfolioFilter === 'function') {
        window.initPortfolioFilter();
      }
      if (typeof window.initLightboxModal === 'function') {
        window.initLightboxModal();
      }
    }
  }

  // Khởi tạo global instance
  window.ProjectsStore = new ProjectsStore();

  // Tự động gắn hook khi DOM sẵn sàng hoặc khi SPA chuyển trang
  function autoRenderProjects() {
    if (document.querySelector('.single-showcase-slider')) {
      window.ProjectsStore.renderSlider('.single-showcase-slider');
    }
    if (document.querySelector('.asymmetric-grid')) {
      window.ProjectsStore.renderProjectsGrid('.asymmetric-grid');
    }
  }

  document.addEventListener('DOMContentLoaded', autoRenderProjects);
  document.addEventListener('spa:navigated', autoRenderProjects);
  document.addEventListener('acnt:projects-updated', autoRenderProjects);
})();
