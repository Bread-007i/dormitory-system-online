const db = require('../config/db');

// ✅ CREATE - Add new maintenance request
exports.createMaintenance = async (req, res) => {
  try {
    const { apartment_id, description, status } = req.body;

    if (!apartment_id || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO maintenance 
      (apartment_id, description, status)
      VALUES (?, ?, ?)`,
      [apartment_id, description, status || 'pending']
    );

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating maintenance:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating maintenance',
      error: err.message
    });
  }
};

// ✅ READ - Get all maintenance requests
exports.getAllMaintenance = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       ORDER BY m.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error('Error fetching maintenance:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance',
      error: err.message
    });
  }
};

// ✅ READ - Get maintenance by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       WHERE m.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('Error fetching maintenance:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance',
      error: err.message
    });
  }
};

// ✅ UPDATE - Update maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { apartment_id, description, status, completed_date } = req.body;

    const [existing] = await db.query('SELECT id FROM maintenance WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    await db.query(
      `UPDATE maintenance 
      SET apartment_id=?, description=?, status=?, completed_date=?
      WHERE id=?`,
      [apartment_id, description, status, completed_date || null, id]
    );

    res.status(200).json({
      success: true,
      message: 'Maintenance updated successfully'
    });

  } catch (err) {
    console.error('Error updating maintenance:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating maintenance',
      error: err.message
    });
  }
};

// ✅ DELETE - Delete maintenance
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM maintenance WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    await db.query('DELETE FROM maintenance WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Maintenance deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting maintenance:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting maintenance',
      error: err.message
    });
  }
};
