const db = require('../config/db');
const { getTenantProfileByUserId } = require('../utils/tenantContext');

exports.getOverview = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);

  if (!ctx?.tenant) {
    return res.status(404).json({
      success: false,
      message:
        'ไม่พบข้อมูลผู้เช่าที่ผูกกับบัญชีนี้ กรุณาให้เจ้าหน้าที่ตั้งอีเมลในระบบผู้เช่าให้ตรงกับบัญชี login'
    });
  }

  const tenantId = ctx.tenant.id;

  const [[bills], [payments], [maintenance]] = await Promise.all([
    db.query(
      `SELECT b.* FROM bills b WHERE b.tenant_id = ? ORDER BY b.billing_date DESC`,
      [tenantId]
    ),
    db.query(
      `SELECT p.* FROM payments p
       INNER JOIN bills b ON p.bill_id = b.id
       WHERE b.tenant_id = ? ORDER BY p.payment_date DESC`,
      [tenantId]
    ),
    db.query(
      `SELECT m.* FROM maintenance m WHERE m.apartment_id = ? ORDER BY m.created_date DESC`,
      [ctx.tenant.apartment_id]
    ),
  ]);

  const pendingBills = bills.filter((b) => b.status === 'pending').length;

  res.json({
    success: true,
    data: {
      user: ctx.user,
      tenant: ctx.tenant,
      stats: {
        totalBills: bills.length,
        pendingBills,
        totalPayments: payments.length,
        maintenanceRequests: maintenance.length,
      },
      bills,
      payments,
      maintenance,
    },
  });
};

exports.getMyRoom = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลห้องของคุณ' });
  }
  res.json({ success: true, data: ctx.tenant });
};

exports.getMyBills = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เช่า' });
  }
  const [rows] = await db.query(
    `SELECT b.*, 
      (SELECT COUNT(*) FROM bill_items bi WHERE bi.bill_id = b.id) as item_count
     FROM bills b WHERE b.tenant_id = ? ORDER BY b.billing_date DESC`,
    [ctx.tenant.id]
  );
  res.json({ success: true, count: rows.length, data: rows });
};

exports.getMyBillDetail = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เช่า' });
  }
  const [bills] = await db.query(
    'SELECT * FROM bills WHERE id = ? AND tenant_id = ?',
    [req.params.id, ctx.tenant.id]
  );
  if (!bills.length) {
    return res.status(404).json({ success: false, message: 'ไม่พบใบแจ้งหนี้' });
  }
  const [items] = await db.query(
    'SELECT * FROM bill_items WHERE bill_id = ?',
    [req.params.id]
  );
  res.json({
    success: true,
    data: { ...bills[0], items },
  });
};

exports.getMyPayments = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลผู้เช่า' });
  }
  const [rows] = await db.query(
    `SELECT p.*, b.billing_date, b.amount as bill_amount
     FROM payments p
     INNER JOIN bills b ON p.bill_id = b.id
     WHERE b.tenant_id = ?
     ORDER BY p.payment_date DESC`,
    [ctx.tenant.id]
  );
  res.json({ success: true, count: rows.length, data: rows });
};

exports.getMyMaintenance = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant?.apartment_id) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลหอพัก' });
  }
  const [rows] = await db.query(
    `SELECT m.*, a.name as apartment_name
     FROM maintenance m
     LEFT JOIN apartments a ON m.apartment_id = a.id
     WHERE m.apartment_id = ?
     ORDER BY m.created_date DESC`,
    [ctx.tenant.apartment_id]
  );
  res.json({ success: true, count: rows.length, data: rows });
};

exports.createMyMaintenance = async (req, res) => {
  const ctx = await getTenantProfileByUserId(req.user.id);
  if (!ctx?.tenant?.apartment_id) {
    return res.status(404).json({ success: false, message: 'ไม่พบข้อมูลหอพัก' });
  }
  const { description } = req.body;
  if (!description?.trim()) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุรายละเอียด' });
  }
  const [result] = await db.query(
    `INSERT INTO maintenance (apartment_id, description, status) VALUES (?, ?, 'pending')`,
    [ctx.tenant.apartment_id, description.trim()]
  );
  res.status(201).json({
    success: true,
    message: 'ส่งคำขอแจ้งซ่อมแล้ว',
    id: result.insertId,
  });
};
