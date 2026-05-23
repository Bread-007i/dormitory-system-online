const db = require('../config/db');

class RoomModel {
  // Get all rooms
  static async getAll() {
    const [rows] = await db.query(
      `SELECT r.*, a.name as apartment_name 
       FROM rooms r 
       LEFT JOIN apartments a ON r.apartment_id = a.id 
       ORDER BY r.created_at DESC`
    );
    return rows;
  }

  // Get room by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT r.*, a.name as apartment_name 
       FROM rooms r 
       LEFT JOIN apartments a ON r.apartment_id = a.id 
       WHERE r.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Create room
  static async create(data) {
    const { apartment_id, room_number, room_type, capacity, rent_price, status } = data;
    const [result] = await db.query(
      `INSERT INTO rooms (apartment_id, room_number, room_type, capacity, rent_price, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [apartment_id, room_number, room_type, capacity, rent_price, status || 'available']
    );
    return result.insertId;
  }

  // Update room
  static async update(id, data) {
    const { apartment_id, room_number, room_type, capacity, rent_price, status } = data;
    const [result] = await db.query(
      `UPDATE rooms 
       SET apartment_id=?, room_number=?, room_type=?, capacity=?, rent_price=?, status=?
       WHERE id=?`,
      [apartment_id, room_number, room_type, capacity, rent_price, status, id]
    );
    return result.affectedRows > 0;
  }

  // Delete room
  static async delete(id) {
    const [result] = await db.query('DELETE FROM rooms WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get available rooms
  static async getAvailable() {
    const [rows] = await db.query(
      `SELECT r.*, a.name as apartment_name 
       FROM rooms r 
       LEFT JOIN apartments a ON r.apartment_id = a.id 
       WHERE r.status = 'available'
       ORDER BY r.created_at DESC`
    );
    return rows;
  }

  // Get rooms by apartment
  static async getByApartment(apartmentId) {
    const [rows] = await db.query(
      `SELECT * FROM rooms WHERE apartment_id = ? ORDER BY room_number`,
      [apartmentId]
    );
    return rows;
  }
}

module.exports = RoomModel;
