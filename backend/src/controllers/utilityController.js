const db = require('../config/db');

exports.getAllUtilities = async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.*, a.name as apartment_name
     FROM utilities u
     LEFT JOIN apartments a ON u.apartment_id = a.id
     ORDER BY u.created_at DESC`
  );
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getUtilityById = async (req, res) => {
  const [rows] = await db.query(
    `SELECT u.*, a.name as apartment_name
     FROM utilities u
     LEFT JOIN apartments a ON u.apartment_id = a.id
     WHERE u.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Utility not found' });
  }
  res.status(200).json({ success: true, data: rows[0] });
};

exports.createUtility = async (req, res) => {
  const { apartment_id, utility_name, unit_price } = req.body;
  if (!apartment_id || !utility_name || unit_price == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const [result] = await db.query(
    `INSERT INTO utilities (apartment_id, utility_name, unit_price) VALUES (?, ?, ?)`,
    [apartment_id, utility_name, unit_price]
  );
  res.status(201).json({
    success: true,
    message: 'Utility created successfully',
    id: result.insertId
  });
};

exports.updateUtility = async (req, res) => {
  const { id } = req.params;
  const { apartment_id, utility_name, unit_price } = req.body;
  const [existing] = await db.query('SELECT id FROM utilities WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Utility not found' });
  }
  await db.query(
    `UPDATE utilities SET apartment_id=?, utility_name=?, unit_price=? WHERE id=?`,
    [apartment_id, utility_name, unit_price, id]
  );
  res.status(200).json({ success: true, message: 'Utility updated successfully' });
};

exports.deleteUtility = async (req, res) => {
  const { id } = req.params;
  const [existing] = await db.query('SELECT id FROM utilities WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Utility not found' });
  }
  await db.query('DELETE FROM utilities WHERE id = ?', [id]);
  res.status(200).json({ success: true, message: 'Utility deleted successfully' });
};
