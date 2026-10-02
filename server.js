// Server chính của ứng dụng
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Phục vụ file tĩnh (HTML/CSS/JS)

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
  { path: '/thanks', file: 'pages/thanks.html' }
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

