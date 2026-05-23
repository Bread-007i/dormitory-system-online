const db = require('../config/db');

// ✅ CREATE - Add new apartment
exports.createApartment = async (req, res) => {
  try {
    const { name, address, city, postal_code, total_rooms, description } = req.body;

    // Validate required fields
    if (!name || !address || !city || !postal_code || !total_rooms) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const [result] = await db.query(
      `INSERT INTO apartments 
      (name, address, city, postal_code, total_rooms, description)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [name, address, city, postal_code, total_rooms, description]
    );

    res.status(201).json({
      success: true,
      message: 'Apartment created successfully',
      id: result.insertId
    });

  } catch (err) {
    console.error('Error creating apartment:', err);
    res.status(500).json({
      success: false,
      message: 'Error creating apartment',
      error: err.message
    });
  }
};

// ✅ READ - Get all apartments
exports.getAllApartments = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM apartments ORDER BY created_at DESC');
    
    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });

  } catch (err) {
    console.error('Error fetching apartments:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching apartments',
      error: err.message
    });
  }
};

// ✅ READ - Get apartment by ID
exports.getApartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      'SELECT * FROM apartments WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });

  } catch (err) {
    console.error('Error fetching apartment:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching apartment',
      error: err.message
    });
  }
};

// ✅ UPDATE - Update apartment
exports.updateApartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, postal_code, total_rooms, description } = req.body;

    // Check if apartment exists
    const [existing] = await db.query('SELECT id FROM apartments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found'
      });
    }

    await db.query(
      `UPDATE apartments 
      SET name=?, address=?, city=?, postal_code=?, total_rooms=?, description=?
      WHERE id=?`,
      [name, address, city, postal_code, total_rooms, description, id]
    );

    res.status(200).json({
      success: true,
      message: 'Apartment updated successfully'
    });

  } catch (err) {
    console.error('Error updating apartment:', err);
    res.status(500).json({
      success: false,
      message: 'Error updating apartment',
      error: err.message
    });
  }
};

// ✅ DELETE - Delete apartment
exports.deleteApartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if apartment exists
    const [existing] = await db.query('SELECT id FROM apartments WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Apartment not found'
      });
    }

    await db.query('DELETE FROM apartments WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Apartment deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting apartment:', err);
    res.status(500).json({
      success: false,
      message: 'Error deleting apartment',
      error: err.message
    });
  }
};
