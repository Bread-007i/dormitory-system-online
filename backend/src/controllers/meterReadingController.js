const db = require('../config/db');

exports.getAllMeterReadings = async (req, res) => {
  const [rows] = await db.query(
    `SELECT mr.*, r.room_number, u.utility_name
     FROM meter_readings mr
     LEFT JOIN rooms r ON mr.room_id = r.id
     LEFT JOIN utilities u ON mr.utility_id = u.id
     ORDER BY mr.reading_date DESC`
  );
  res.status(200).json({ success: true, count: rows.length, data: rows });
};

exports.getMeterReadingById = async (req, res) => {
  const [rows] = await db.query(
    `SELECT mr.*, r.room_number, u.utility_name
     FROM meter_readings mr
     LEFT JOIN rooms r ON mr.room_id = r.id
     LEFT JOIN utilities u ON mr.utility_id = u.id
     WHERE mr.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Meter reading not found' });
  }
  res.status(200).json({ success: true, data: rows[0] });
};

exports.createMeterReading = async (req, res) => {
  const { room_id, utility_id, reading_value, reading_date } = req.body;
  if (!room_id || !utility_id || reading_value == null || !reading_date) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }
  const [result] = await db.query(
    `INSERT INTO meter_readings (room_id, utility_id, reading_value, reading_date)
     VALUES (?, ?, ?, ?)`,
    [room_id, utility_id, reading_value, reading_date]
  );
  res.status(201).json({
    success: true,
    message: 'Meter reading created successfully',
    id: result.insertId
  });
};

exports.updateMeterReading = async (req, res) => {
  const { id } = req.params;
  const { room_id, utility_id, reading_value, reading_date } = req.body;
  const [existing] = await db.query('SELECT id FROM meter_readings WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Meter reading not found' });
  }
  await db.query(
    `UPDATE meter_readings SET room_id=?, utility_id=?, reading_value=?, reading_date=? WHERE id=?`,
    [room_id, utility_id, reading_value, reading_date, id]
  );
  res.status(200).json({ success: true, message: 'Meter reading updated successfully' });
};

exports.deleteMeterReading = async (req, res) => {
  const { id } = req.params;
  const [existing] = await db.query('SELECT id FROM meter_readings WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Meter reading not found' });
  }
  await db.query('DELETE FROM meter_readings WHERE id = ?', [id]);
  res.status(200).json({ success: true, message: 'Meter reading deleted successfully' });
};
