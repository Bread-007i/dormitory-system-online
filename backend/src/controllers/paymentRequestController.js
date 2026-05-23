const db = require('../config/db');
const paymentConfig = require('../config/paymentConfig');
const { getTenantProfileByUserId } = require('../utils/tenantContext');
const generateReference = require('../utils/generateReference');
const { completePaymentRequest } = require('../services/paymentVerifyService');

async function assertTenantBill(userId, billId) {
  const ctx = await getTenantProfileByUserId(userId);
  if (!ctx?.tenant) return { error: 'ไม่พบข้อมูลผู้เช่า', status: 404 };

  const [bills] = await db.query(
    'SELECT * FROM bills WHERE id = ? AND tenant_id = ?',
    [billId, ctx.tenant.id]
  );
  if (!bills.length) {
    return { error: 'ไม่พบใบแจ้งหนี้', status: 404 };
  }
  return { ctx, bill: bills[0] };
}

exports.createPaymentRequest = async (req, res) => {
  const billId = Number(req.body.bill_id);
  const check = await assertTenantBill(req.user.id, billId);
  if (check.error) {
    return res.status(check.status).json({ success: false, message: check.error });
  }

  const { bill, ctx } = check;

  if (bill.status === 'paid') {
    return res.status(400).json({ success: false, message: 'บิลนี้ชำระแล้ว' });
  }

  const [pending] = await db.query(
    `SELECT id, reference_code, status FROM payment_requests
     WHERE bill_id = ? AND status IN ('pending_payment', 'pending_verification')
     ORDER BY id DESC LIMIT 1`,
    [billId]
  );

  if (pending.length) {
    return res.status(200).json({
      success: true,
      message: 'มีคำขอชำระที่ยังไม่เสร็จอยู่แล้ว',
      data: {
        requestId: pending[0].id,
        referenceCode: pending[0].reference_code,
        status: pending[0].status,
        amount: bill.amount,
        promptPay: paymentConfig,
      },
    });
  }

  const referenceCode = generateReference(billId);

  const [result] = await db.query(
    `INSERT INTO payment_requests (bill_id, tenant_id, reference_code, amount_expected, status)
     VALUES (?, ?, ?, ?, 'pending_payment')`,
    [billId, ctx.tenant.id, referenceCode, bill.amount]
  );

  res.status(201).json({
    success: true,
    message: 'สร้างคำขอชำระเงินแล้ว',
    data: {
      requestId: result.insertId,
      referenceCode,
      amount: Number(bill.amount),
      billId,
      promptPay: paymentConfig,
      instructions: [
        'สแกน QR แล้วโอนยอดให้ตรงกับใบแจ้งหนี้',
        `ใส่เลขอ้างอิง ${referenceCode} ในหมายเหตุการโอน`,
        'อัปโหลดสลิปการโอนหลังชำระเงินเสร็จ',
      ],
    },
  });
};

exports.getPaymentRequest = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เช่า' });
  }

  const [rows] = await db.query(
    `SELECT pr.*, b.billing_date, b.due_date
     FROM payment_requests pr
     INNER JOIN bills b ON pr.bill_id = b.id
     WHERE pr.id = ? AND pr.tenant_id = ?`,
    [req.params.id, ctx.tenant.id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });
  }

  const row = rows[0];
  res.json({
    success: true,
    data: {
      ...row,
      slipUrl: row.slip_filename ? `/uploads/slips/${row.slip_filename}` : null,
      promptPay: paymentConfig,
    },
  });
};

exports.uploadSlip = async (req, res) => {
  const amountReported = Number(req.body.amount_reported);
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เช่า' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'กรุณาอัปโหลดสลิป' });
  }

  const [rows] = await db.query(
    'SELECT * FROM payment_requests WHERE id = ? AND tenant_id = ?',
    [req.params.id, ctx.tenant.id]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });
  }

  const pr = rows[0];

  if (pr.status === 'verified') {
    return res.status(400).json({ success: false, message: 'ชำระเงินแล้ว' });
  }

  const reported = amountReported || Number(pr.amount_expected);

  await db.query(
    `UPDATE payment_requests
     SET slip_filename = ?, slip_original_name = ?, amount_reported = ?, status = 'pending_verification'
     WHERE id = ?`,
    [req.file.filename, req.file.originalname, reported, pr.id]
  );

  let autoResult = null;

  if (paymentConfig.autoVerify) {
    const expected = Number(pr.amount_expected);
    if (Math.abs(reported - expected) < 0.01) {
      try {
        autoResult = await completePaymentRequest(pr.id, {
          amount: reported,
          verifiedBy: null,
          method: 'PromptPay QR (auto)',
        });
      } catch (err) {
        autoResult = { error: err.message };
      }
    }
  }

  const [updated] = await db.query('SELECT * FROM payment_requests WHERE id = ?', [pr.id]);

  res.json({
    success: true,
    message: autoResult?.paymentId
      ? 'ยืนยันการชำระเงินเรียบร้อยแล้ว'
      : 'รับสลิปแล้ว — รอเจ้าหน้าที่ตรวจสอบ',
    data: {
      ...updated[0],
      slipUrl: `/uploads/slips/${req.file.filename}`,
      autoVerified: Boolean(autoResult?.paymentId),
      autoVerifyDetail: autoResult,
    },
  });
};

/** จำลองธนาคารแจ้งโอนสำเร็จ (ทดสอบ) */
exports.simulateBankWebhook = async (req, res) => {
  if (!paymentConfig.allowSimulateWebhook) {
    return res.status(403).json({ success: false, message: 'ปิดใช้งานใน production' });
  }

  const { reference_code, amount } = req.body;
  if (!reference_code) {
    return res.status(400).json({ success: false, message: 'ต้องมี reference_code' });
  }

  const [rows] = await db.query(
    'SELECT * FROM payment_requests WHERE reference_code = ?',
    [reference_code]
  );

  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบเลขอ้างอิง' });
  }

  const pr = rows[0];
  const payAmount = Number(amount ?? pr.amount_expected);

  await db.query(
    `UPDATE payment_requests SET amount_reported = ?, status = 'pending_verification' WHERE id = ?`,
    [payAmount, pr.id]
  );

  const result = await completePaymentRequest(pr.id, {
    amount: payAmount,
    method: 'PromptPay (simulated webhook)',
  });

  res.json({
    success: true,
    message: 'จำลองการแจ้งจากธนาคารสำเร็จ',
    data: result,
  });
};

exports.listPendingForStaff = async (req, res) => {
  const status = req.query.status || 'pending_verification';
  const [rows] = await db.query(
    `SELECT pr.*, t.name as tenant_name, b.billing_date, b.due_date
     FROM payment_requests pr
     INNER JOIN tenants t ON pr.tenant_id = t.id
     INNER JOIN bills b ON pr.bill_id = b.id
     WHERE pr.status = ?
     ORDER BY pr.updated_at DESC`,
    [status]
  );

  const data = rows.map((r) => ({
    ...r,
    slipUrl: r.slip_filename ? `/uploads/slips/${r.slip_filename}` : null,
  }));

  res.json({ success: true, count: data.length, data });
};

exports.approveRequest = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM payment_requests WHERE id = ?', [
    req.params.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });
  }

  const amount = Number(req.body.amount ?? rows[0].amount_reported ?? rows[0].amount_expected);

  const result = await completePaymentRequest(req.params.id, {
    amount,
    verifiedBy: req.user.id,
    method: 'PromptPay QR (manual approve)',
  });

  res.json({ success: true, message: 'ยืนยันการชำระแล้ว', data: result });
};

exports.rejectRequest = async (req, res) => {
  const { reason } = req.body;
  const [rows] = await db.query('SELECT * FROM payment_requests WHERE id = ?', [
    req.params.id,
  ]);
  if (!rows.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบรายการ' });
  }

  await db.query(
    `UPDATE payment_requests SET status = 'rejected', reject_reason = ?, verified_by = ?
     WHERE id = ?`,
    [reason || 'สลิปไม่ถูกต้อง', req.user.id, req.params.id]
  );

  res.json({ success: true, message: 'ปฏิเสธรายการแล้ว' });
};
