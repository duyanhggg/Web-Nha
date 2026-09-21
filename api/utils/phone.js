function toVietnamE164(phoneNumber) {
  const digits = String(phoneNumber || '').replace(/\D/g, '');

  if (/^0\d{9}$/.test(digits)) return `+84${digits.slice(1)}`;
  if (/^84\d{9}$/.test(digits)) return `+${digits}`;

  return null;
}

module.exports = { toVietnamE164 };
