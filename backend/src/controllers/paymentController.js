const db = require('../config/db');

exports.getAllPayments = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, b.tenant_id, t.name as tenant_name
     FROM payments p
     LEFT JOIN bills b ON p.bill_id = b.id
     LEFT JOIN tenants t ON b.tenant_id = t.id
     ORDER BY p.payment_date DESC`
  );
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getPaymentById = async (req, res) => {
  const [rows] = await db.query(
    `SELECT p.*, b.tenant_id, t.name as tenant_name
     FROM payments p
     LEFT JOIN bills b ON p.bill_id = b.id
     LEFT JOIN tenants t ON b.tenant_id = t.id
     WHERE p.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  res.status(200).json({ success: true, data: rows[0] });
};

exports.createPayment = async (req, res) => {
  const { bill_id, payment_date, amount_paid, payment_method, status } = req.body;
  if (!bill_id || amount_paid == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const [result] = await db.query(
    `INSERT INTO payments (bill_id, payment_date, amount_paid, payment_method, status)
     VALUES (?, ?, ?, ?, ?)`,
    [
      bill_id,
      payment_date || new Date(),
      amount_paid,
      payment_method || null,
      status || 'completed'
    ]
  );
  res.status(201).json({
    success: true,
    message: 'Payment created successfully',
    id: result.insertId
  });
};

exports.updatePayment = async (req, res) => {
  const { id } = req.params;
  const { bill_id, payment_date, amount_paid, payment_method, status } = req.body;
  const [existing] = await db.query('SELECT id FROM payments WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  await db.query(
    `UPDATE payments SET bill_id=?, payment_date=?, amount_paid=?, payment_method=?, status=? WHERE id=?`,
    [bill_id, payment_date, amount_paid, payment_method, status, id]
  );
  res.status(200).json({ success: true, message: 'Payment updated successfully' });
};

exports.deletePayment = async (req, res) => {
  const { id } = req.params;
  const [existing] = await db.query('SELECT id FROM payments WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Payment not found' });
  }
  await db.query('DELETE FROM payments WHERE id = ?', [id]);
  res.status(200).json({ success: true, message: 'Payment deleted successfully' });
};
