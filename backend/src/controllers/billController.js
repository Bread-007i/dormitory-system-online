const db = require('../config/db');

// ✅ CREATE - Add new bill
exports.createBill = async (req, res) => {
  try {
    const { tenant_id, billing_date, due_date, amount, status, payment_date } = req.body;

    if (!tenant_id || !billing_date || !due_date || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO bills 
      (tenant_id, billing_date, due_date, amount, status, payment_date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [tenant_id, billing_date, due_date, amount, status || 'pending', payment_date || null]
    );

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating bill:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating bill',
      error: err.message
    });
  }
};

// ✅ READ - Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       ORDER BY b.created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error('Error fetching bills:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: err.message
    });
  }
};

// ✅ READ - Get bill by ID
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       WHERE b.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('Error fetching bill:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill',
      error: err.message
    });
  }
};

// ✅ UPDATE - Update bill
exports.updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenant_id, billing_date, due_date, amount, status, payment_date } = req.body;

    const [existing] = await db.query('SELECT id FROM bills WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    await db.query(
      `UPDATE bills 
      SET tenant_id=?, billing_date=?, due_date=?, amount=?, status=?, payment_date=?
      WHERE id=?`,
      [tenant_id, billing_date, due_date, amount, status, payment_date, id]
    );

    res.status(200).json({
      success: true,
      message: 'Bill updated successfully'
    });

  } catch (err) {
    console.error('Error updating bill:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating bill',
      error: err.message
    });
  }
};

// ✅ DELETE - Delete bill
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const [existing] = await db.query('SELECT id FROM bills WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    await db.query('DELETE FROM bills WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Bill deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting bill:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting bill',
      error: err.message
    });
  }
};
