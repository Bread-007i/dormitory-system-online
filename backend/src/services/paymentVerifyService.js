const db = require('../config/db');

/**
 * ยืนยันการชำระ: สร้าง payments + อัปเดตบิล + อัปเดต payment_requests
 */
async function completePaymentRequest(requestId, { amount, verifiedBy = null, method = 'PromptPay QR' }) {
  const [rows] = await db.query(
    `SELECT pr.*, b.status as bill_status
     FROM payment_requests pr
     INNER JOIN bills b ON pr.bill_id = b.id
     WHERE pr.id = ?`,
    [requestId]
  );

  if (!rows.length) {
    throw new Error('ไม่พบรายการชำระเงิน');
  }

  const pr = rows[0];

  if (pr.status === 'verified') {
    return { alreadyVerified: true, paymentId: pr.payment_id };
  }

  if (!['pending_payment', 'pending_verification'].includes(pr.status)) {
    throw new Error('สถานะรายการไม่สามารถยืนยันได้');
  }

  const payAmount = Number(amount ?? pr.amount_reported ?? pr.amount_expected);

  const [payResult] = await db.query(
    `INSERT INTO payments (bill_id, amount_paid, payment_method, status)
     VALUES (?, ?, ?, 'completed')`,
    [pr.bill_id, payAmount, method]
  );

  const paymentId = payResult.insertId;

  await db.query(
    `UPDATE bills SET status = 'paid', payment_date = CURDATE() WHERE id = ?`,
    [pr.bill_id]
  );

  await db.query(
    `UPDATE payment_requests
     SET status = 'verified', amount_verified = ?, verified_at = NOW(),
         verified_by = ?, payment_id = ?
     WHERE id = ?`,
    [payAmount, verifiedBy, paymentId, requestId]
  );

  return { paymentId, billId: pr.bill_id, referenceCode: pr.reference_code };
}

module.exports = { completePaymentRequest };
