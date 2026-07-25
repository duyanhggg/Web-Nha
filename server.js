// Server chính của ứng dụng
const express = require('express');
const cors = require('cors');
const path = require('path');
const sendConsultSms = require('./api/send-consult-sms');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Phục vụ file tĩnh (HTML/CSS/JS)

// API route
app.use('/api', sendConsultSms);

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log('Để cấu hình Twilio, hãy điền thông tin vào file .env:');
  console.log('- TWILIO_ACCOUNT_SID=');
  console.log('- TWILIO_AUTH_TOKEN=');
  console.log('- TWILIO_PHONE_NUMBER=+84xxxxxxxxx');
});