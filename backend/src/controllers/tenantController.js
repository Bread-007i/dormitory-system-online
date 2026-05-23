const db = require('../config/db');

// ✅ CREATE - Add new tenant
exports.createTenant = async (req, res) => {
  try {
    const { room_id, name, phone, email, id_card, contract_start, contract_end, status } = req.body;

    if (!room_id || !name || !contract_start) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO tenants 
      (room_id, name, phone, email, id_card, contract_start, contract_end, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [room_id, name, phone, email, id_card, contract_start, contract_end, status || 'active']
    );

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating tenant:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating tenant',
      error: err.message
    });
  }
};

// ✅ READ - Get all tenants
exports.getAllTenants = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT t.*, r.room_number, a.name as apartment_name
       FROM tenants t
       LEFT JOIN rooms r ON t.room_id = r.id
       LEFT JOIN apartments a ON r.apartment_id = a.id
       ORDER BY t.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error('Error fetching tenants:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching tenants',
      error: err.message
    });
  }
};

// ✅ READ - Get tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT t.*, r.room_number, a.name as apartment_name
       FROM tenants t
       LEFT JOIN rooms r ON t.room_id = r.id
       LEFT JOIN apartments a ON r.apartment_id = a.id
       WHERE t.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('Error fetching tenant:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant',
      error: err.message
    });
  }
};

// ✅ UPDATE - Update tenant
exports.updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, name, phone, email, id_card, contract_start, contract_end, status } = req.body;

    const [existing] = await db.query('SELECT id FROM tenants WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    await db.query(
      `UPDATE tenants 
      SET room_id=?, name=?, phone=?, email=?, id_card=?, contract_start=?, contract_end=?, status=?
      WHERE id=?`,
      [room_id, name, phone, email, id_card, contract_start, contract_end, status, id]
    );

    res.status(200).json({
      success: true,
      message: 'Tenant updated successfully'
    });

  } catch (err) {
    console.error('Error updating tenant:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating tenant',
      error: err.message
    });
  }
};

// ✅ DELETE - Delete tenant
exports.deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM tenants WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    await db.query('DELETE FROM tenants WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Tenant deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting tenant:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting tenant',
      error: err.message
    });
  }
};
