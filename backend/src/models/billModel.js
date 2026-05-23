const db = require('../config/db');

class BillModel {
  // Get all bills
  static async getAll() {
    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       ORDER BY b.created_at DESC`
    );
    return rows;
  }

  // Get bill by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  // Create bill
  static async create(data) {
    const { tenant_id, billing_date, due_date, amount, status, payment_date } = data;
    const [result] = await db.query(
      `INSERT INTO bills (tenant_id, billing_date, due_date, amount, status, payment_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tenant_id, billing_date, due_date, amount, status || 'pending', payment_date || null]
    );
    return result.insertId;
  }

  // Update bill
  static async update(id, data) {
    const { tenant_id, billing_date, due_date, amount, status, payment_date } = data;
    const [result] = await db.query(
      `UPDATE bills 
       SET tenant_id=?, billing_date=?, due_date=?, amount=?, status=?, payment_date=?
       WHERE id=?`,
      [tenant_id, billing_date, due_date, amount, status, payment_date, id]
    );
    return result.affectedRows > 0;
  }

  // Delete bill
  static async delete(id) {
    const [result] = await db.query('DELETE FROM bills WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get pending bills
  static async getPending() {
    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       WHERE b.status = 'pending'
       ORDER BY b.due_date ASC`
    );
    return rows;
  }

  // Get bills by tenant
  static async getByTenant(tenantId) {
    const [rows] = await db.query(
      `SELECT * FROM bills WHERE tenant_id = ? ORDER BY billing_date DESC`,
      [tenantId]
    );
    return rows;
  }

  // Get overdue bills
  static async getOverdue() {
    const [rows] = await db.query(
      `SELECT b.*, t.name as tenant_name, r.room_number
       FROM bills b
       LEFT JOIN tenants t ON b.tenant_id = t.id
       LEFT JOIN rooms r ON t.room_id = r.id
       WHERE b.status = 'pending' AND b.due_date < CURDATE()
       ORDER BY b.due_date ASC`
    );
    return rows;
  }
}

module.exports = BillModel;
