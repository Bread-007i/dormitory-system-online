const db = require('../config/db');

// ✅ CREATE - Add new room
exports.createRoom = async (req, res) => {
  try {
    const { apartment_id, room_number, room_type, capacity, rent_price, status } = req.body;

    if (!apartment_id || !room_number || !room_type || !capacity || !rent_price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO rooms 
      (apartment_id, room_number, room_type, capacity, rent_price, status)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [apartment_id, room_number, room_type, capacity, rent_price, status || 'available']
    );

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating room:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating room',
      error: err.message
    });
  }
};

// ✅ READ - Get all rooms
exports.getAllRooms = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT r.*, a.name as apartment_name 
       FROM rooms r 
       LEFT JOIN apartments a ON r.apartment_id = a.id 
       ORDER BY r.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error('Error fetching rooms:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching rooms',
      error: err.message
    });
  }
};

// ✅ READ - Get room by ID
exports.getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT r.*, a.name as apartment_name 
       FROM rooms r 
       LEFT JOIN apartments a ON r.apartment_id = a.id 
       WHERE r.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('Error fetching room:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching room',
      error: err.message
    });
  }
};

// ✅ UPDATE - Update room
exports.updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { apartment_id, room_number, room_type, capacity, rent_price, status } = req.body;

    const [existing] = await db.query('SELECT id FROM rooms WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await db.query(
      `UPDATE rooms 
      SET apartment_id=?, room_number=?, room_type=?, capacity=?, rent_price=?, status=?
      WHERE id=?`,
      [apartment_id, room_number, room_type, capacity, rent_price, status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Room updated successfully'
    });

  } catch (err) {
    console.error('Error updating room:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating room',
      error: err.message
    });
  }
};

// ✅ DELETE - Delete room
exports.deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM rooms WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    await db.query('DELETE FROM rooms WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting room:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting room',
      error: err.message
    });
  }
};
