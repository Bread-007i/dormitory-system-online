const db = require('../config/db');

exports.getAllContracts = async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.*, t.name as tenant_name, r.room_number
     FROM contracts c
     LEFT JOIN tenants t ON c.tenant_id = t.id
     LEFT JOIN rooms r ON c.room_id = r.id
     ORDER BY c.created_at DESC`
  );
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getContractById = async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.*, t.name as tenant_name, r.room_number
     FROM contracts c
     LEFT JOIN tenants t ON c.tenant_id = t.id
     LEFT JOIN rooms r ON c.room_id = r.id
     WHERE c.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }
  res.status(200).json({ success: true, data: rows[0] });
};

exports.createContract = async (req, res) => {
  const { tenant_id, room_id, start_date, end_date, terms, status } = req.body;
  if (!tenant_id || !room_id || !start_date) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const [result] = await db.query(
    `INSERT INTO contracts (tenant_id, room_id, start_date, end_date, terms, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tenant_id, room_id, start_date, end_date || null, terms || null, status || 'active']
  );
  res.status(201).json({
    success: true,
    message: 'Contract created successfully',
    id: result.insertId
  });
};

exports.updateContract = async (req, res) => {
  const { id } = req.params;
  const { tenant_id, room_id, start_date, end_date, terms, status } = req.body;
  const [existing] = await db.query('SELECT id FROM contracts WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }
  await db.query(
    `UPDATE contracts SET tenant_id=?, room_id=?, start_date=?, end_date=?, terms=?, status=? WHERE id=?`,
    [tenant_id, room_id, start_date, end_date, terms, status, id]
  );
  res.status(200).json({ success: true, message: 'Contract updated successfully' });
};

exports.deleteContract = async (req, res) => {
  const { id } = req.params;
  const [existing] = await db.query('SELECT id FROM contracts WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Contract not found' });
  }
  await db.query('DELETE FROM contracts WHERE id = ?', [id]);
  res.status(200).json({ success: true, message: 'Contract deleted successfully' });
};
