const db = require('../config/db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserModel {
  // Get all users
  static async getAll() {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  // Get user by ID
  static async getById(id) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  // Get user by email
  static async getByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  // Register new user
  static async register(data) {
    const { name, email, password, role = 'tenant' } = data;

    // Check if user already exists
    const existingUser = await this.getByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return result.insertId;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  }

  // Generate JWT token
  static generateToken(userId, role, expiresIn = '7d') {
    return jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn }
    );
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return null;
    }
  }

  // Update user
  static async update(id, data) {
    const { name, email, role } = data;
    const [result] = await db.query(
      'UPDATE users SET name=?, email=?, role=? WHERE id=?',
      [name, email, role, id]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Get users by role
  static async getByRole(role) {
    const [rows] = await db.query(
      'SELECT id, name, email, role, created_at FROM users WHERE role = ?',
      [role]
    );
    return rows;
  }
}

module.exports = UserModel;
