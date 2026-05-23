const db = require('../config/db');

class MaintenanceModel {
  // Get all maintenance
  static async getAll() {
    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       ORDER BY m.created_at DESC`
    );
    return rows;
  }

  // Get maintenance by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Create maintenance
  static async create(data) {
    const { apartment_id, description, status } = data;
    const [result] = await db.query(
      `INSERT INTO maintenance (apartment_id, description, status)
       VALUES (?, ?, ?)`,
      [apartment_id, description, status || 'pending']
    );
    return result.insertId;
  }

  // Update maintenance
  static async update(id, data) {
    const { apartment_id, description, status, completed_date } = data;
    const [result] = await db.query(
      `UPDATE maintenance 
       SET apartment_id=?, description=?, status=?, completed_date=?
       WHERE id=?`,
      [apartment_id, description, status, completed_date || null, id]
    );
    return result.affectedRows > 0;
  }

  // Delete maintenance
  static async delete(id) {
    const [result] = await db.query('DELETE FROM maintenance WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get pending maintenance
  static async getPending() {
    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       WHERE m.status = 'pending'
       ORDER BY m.created_date ASC`
    );
    return rows;
  }

  // Get maintenance by apartment
  static async getByApartment(apartmentId) {
    const [rows] = await db.query(
      `SELECT * FROM maintenance WHERE apartment_id = ? ORDER BY created_date DESC`,
      [apartmentId]
    );
    return rows;
  }

  // Get completed maintenance
  static async getCompleted() {
    const [rows] = await db.query(
      `SELECT m.*, a.name as apartment_name
       FROM maintenance m
       LEFT JOIN apartments a ON m.apartment_id = a.id
       WHERE m.status = 'completed'
       ORDER BY m.completed_date DESC`
    );
    return rows;
  }
}

module.exports = MaintenanceModel;
