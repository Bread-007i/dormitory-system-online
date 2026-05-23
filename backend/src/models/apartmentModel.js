const db = require('../config/db');

class ApartmentModel {
  // Get all apartments
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM apartments ORDER BY created_at DESC');
    return rows;
  }

  // Get apartment by ID
  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM apartments WHERE id = ?', [id]);
    return rows[0] || null;
  }

  // Create apartment
  static async create(data) {
    const { name, address, city, postal_code, total_rooms, description } = data;
    const [result] = await db.query(
      `INSERT INTO apartments (name, address, city, postal_code, total_rooms, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, address, city, postal_code, total_rooms, description]
    );
    return result.insertId;
  }

  // Update apartment
  static async update(id, data) {
    const { name, address, city, postal_code, total_rooms, description } = data;
    const [result] = await db.query(
      `UPDATE apartments 
       SET name=?, address=?, city=?, postal_code=?, total_rooms=?, description=?
       WHERE id=?`,
      [name, address, city, postal_code, total_rooms, description, id]
    );
    return result.affectedRows > 0;
  }

  // Delete apartment
  static async delete(id) {
    const [result] = await db.query('DELETE FROM apartments WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get apartment with rooms count
  static async getWithRoomsCount(id) {
    const [rows] = await db.query(
      `SELECT a.*, COUNT(r.id) as rooms_count
       FROM apartments a
       LEFT JOIN rooms r ON a.id = r.apartment_id
       WHERE a.id = ?
       GROUP BY a.id`,
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = ApartmentModel;
