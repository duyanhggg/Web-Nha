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

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
