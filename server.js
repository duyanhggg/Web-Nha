// Server chính của ứng dụng
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Phục vụ file tĩnh (HTML/CSS/JS)

// Projects Data API
const projectsFilePath = path.join(__dirname, 'data', 'projects.json');

app.get('/api/projects', (req, res) => {
  try {
    if (fs.existsSync(projectsFilePath)) {
      const data = fs.readFileSync(projectsFilePath, 'utf8');
      return res.json(JSON.parse(data));
    }
    return res.json([]);
  } catch (err) {
    console.error('Lỗi đọc data/projects.json:', err);
    res.status(500).json({ error: 'Không thể đọc danh sách dự án' });
  }
});

app.post('/api/projects', (req, res) => {
  try {
    const projects = req.body;
    if (!Array.isArray(projects)) {
      return res.status(400).json({ error: 'Dữ liệu dự án phải là một mảng' });
    }
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');
    return res.json({ success: true, count: projects.length });
  } catch (err) {
    console.error('Lỗi ghi data/projects.json:', err);
    res.status(500).json({ error: 'Không thể lưu danh sách dự án' });
  }
});

// SEO files are stored in config but must be available from the site root.
app.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'config', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'config', 'sitemap.xml'));
});

// SPA Clean URL Route Handlers
const pageRoutes = [
  { path: '/story', file: 'pages/story.html' },
  { path: '/services', file: 'pages/services.html' },
  { path: '/projects', file: 'pages/projects.html' },
  { path: '/process', file: 'pages/process.html' },
  { path: '/testimonials', file: 'pages/testimonials.html' },
  { path: '/news', file: 'pages/news.html' },
  { path: '/contact', file: 'pages/contact.html' },
  { path: '/thanks', file: 'pages/thanks.html' },
  { path: '/admin', file: 'pages/admin.html' }
];

pageRoutes.forEach(({ path: routePath, file }) => {
  app.get(routePath, (req, res) => {
    res.sendFile(path.join(__dirname, file));
  });
});

// Khởi động server (khi chạy độc lập)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
  });
}

module.exports = app;

