const db = require('../config/db');

class TenantModel {
  // Get all tenants
  static async getAll() {
    const [rows] = await db.query(
      `SELECT t.*, r.room_number, a.name as apartment_name
       FROM tenants t
       LEFT JOIN rooms r ON t.room_id = r.id
       LEFT JOIN apartments a ON r.apartment_id = a.id
       ORDER BY t.created_at DESC`
    );
    return rows;
  }

  // Get tenant by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT t.*, r.room_number, a.name as apartment_name
       FROM tenants t
       LEFT JOIN rooms r ON t.room_id = r.id
       LEFT JOIN apartments a ON r.apartment_id = a.id
       WHERE t.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Create tenant
  static async create(data) {
    const { room_id, name, phone, email, id_card, contract_start, contract_end, status } = data;
    const [result] = await db.query(
      `INSERT INTO tenants (room_id, name, phone, email, id_card, contract_start, contract_end, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [room_id, name, phone, email, id_card, contract_start, contract_end, status || 'active']
    );
    return result.insertId;
  }

  // Update tenant
  static async update(id, data) {
    const { room_id, name, phone, email, id_card, contract_start, contract_end, status } = data;
    const [result] = await db.query(
      `UPDATE tenants 
       SET room_id=?, name=?, phone=?, email=?, id_card=?, contract_start=?, contract_end=?, status=?
       WHERE id=?`,
      [room_id, name, phone, email, id_card, contract_start, contract_end, status, id]
    );
    return result.affectedRows > 0;
  }

  // Delete tenant
  static async delete(id) {
    const [result] = await db.query('DELETE FROM tenants WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get active tenants
  static async getActive() {
    const [rows] = await db.query(
      `SELECT t.*, r.room_number, a.name as apartment_name
       FROM tenants t
       LEFT JOIN rooms r ON t.room_id = r.id
       LEFT JOIN apartments a ON r.apartment_id = a.id
       WHERE t.status = 'active'
       ORDER BY t.created_at DESC`
    );
    return rows;
  }

  // Get tenants by room
  static async getByRoom(roomId) {
    const [rows] = await db.query(
      `SELECT * FROM tenants WHERE room_id = ? AND status = 'active'`,
      [roomId]
    );
    return rows;
  }
}

module.exports = TenantModel;
