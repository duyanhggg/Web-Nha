// Backend API để gọi Twilio - không để lộ Account SID/Auth Token ở frontend
// Cài đặt: npm install twilio express cors dotenv
require('dotenv').config();
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

// Khởi tạo Twilio client với thông tin từ file .env
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; // Số điện thoại Twilio bạn mua
const YOUR_PHONE_NUMBER = '0335818138'; // Số điện thoại của bạn để nhận SMS

router.post('/send-consult-sms', async (req, res) => {
  try {
    const { ho_ten, so_dien_thoai_khach, nhu_cau } = req.body;
    
    // Nội dung SMS gửi đến bạn
    const messageToYou = `📩 Khách hàng mới: ${ho_ten} - SĐT: ${so_dien_thoai_khach}. Nhu cầu: ${nhu_cau || 'Tư vấn nội thất'}`;
    
    // Gửi SMS đến số của bạn qua Twilio
    await client.messages.create({
      body: messageToYou,
      from: TWILIO_PHONE_NUMBER,
      to: `+84${YOUR_PHONE_NUMBER.slice(1)}` // Chuyển 0335818138 → +84335818138
    });

    // Gửi SMS xác nhận đến khách hàng
    await client.messages.create({
      body: `Cảm ơn ${ho_ten}! Chúng tôi đã nhận được yêu cầu tư vấn và sẽ liên hệ lại trong 24h. Trân trọng, Nội Thất Anh Chi.`,
      from: TWILIO_PHONE_NUMBER,
      to: `+84${so_dien_thoai_khach.slice(1)}`
    });

    res.status(200).json({ success: true, message: 'SMS sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;