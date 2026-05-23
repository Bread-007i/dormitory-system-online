module.exports = {
  accountName: process.env.PROMPTPAY_ACCOUNT_NAME || 'ด.ช. ธนชัย คำวงศ์',
  accountMask: process.env.PROMPTPAY_ACCOUNT_MASK || 'xxx-x-x5396-x',
  qrImageUrl: process.env.PROMPTPAY_QR_IMAGE || '/promptpay-qr.png',
  /** โหมดทดสอบ: ตรวจอัตโนมัติเมื่ออัปโหลดสลิป + ยอดตรง */
  autoVerify: process.env.PAYMENT_AUTO_VERIFY !== 'false',
  /** จำลอง webhook ธนาคาร (เฉพาะ dev) */
  allowSimulateWebhook: process.env.NODE_ENV !== 'production',
};
