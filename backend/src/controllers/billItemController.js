const db = require('../config/db');

exports.getAllBillItems = async (req, res) => {
  const [rows] = await db.query(
    `SELECT bi.*, b.tenant_id, t.name as tenant_name
     FROM bill_items bi
     LEFT JOIN bills b ON bi.bill_id = b.id
     LEFT JOIN tenants t ON b.tenant_id = t.id
     ORDER BY bi.created_at DESC`
  );
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getBillItemById = async (req, res) => {
  const [rows] = await db.query(
    `SELECT bi.*, b.tenant_id, t.name as tenant_name
     FROM bill_items bi
     LEFT JOIN bills b ON bi.bill_id = b.id
     LEFT JOIN tenants t ON b.tenant_id = t.id
     WHERE bi.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Bill item not found' });
  }
  res.status(200).json({ success: true, data: rows[0] });
};

exports.createBillItem = async (req, res) => {
  const { bill_id, description, quantity, unit_price, total } = req.body;
  if (!bill_id || !description || unit_price == null || total == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const [result] = await db.query(
    `INSERT INTO bill_items (bill_id, description, quantity, unit_price, total)
     VALUES (?, ?, ?, ?, ?)`,
    [bill_id, description, quantity ?? 1, unit_price, total]
  );
  res.status(201).json({
    success: true,
    message: 'Bill item created successfully',
    id: result.insertId
  });
};

exports.updateBillItem = async (req, res) => {
  const { id } = req.params;
  const { bill_id, description, quantity, unit_price, total } = req.body;
  const [existing] = await db.query('SELECT id FROM bill_items WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Bill item not found' });
  }
  await db.query(
    `UPDATE bill_items SET bill_id=?, description=?, quantity=?, unit_price=?, total=? WHERE id=?`,
    [bill_id, description, quantity, unit_price, total, id]
  );
  res.status(200).json({ success: true, message: 'Bill item updated successfully' });
};

exports.deleteBillItem = async (req, res) => {
  const { id } = req.params;
  const [existing] = await db.query('SELECT id FROM bill_items WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Bill item not found' });
  }
  await db.query('DELETE FROM bill_items WHERE id = ?', [id]);
  res.status(200).json({ success: true, message: 'Bill item deleted successfully' });
};
