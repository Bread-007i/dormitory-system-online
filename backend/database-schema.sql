-- ========================================
-- Dormitory System Database Schema
-- ========================================

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

-- Set character set for database
-- ALTER DATABASE dormitory_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS bill_items;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS meter_readings;
DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS bills;
DROP TABLE IF EXISTS maintenance;
DROP TABLE IF EXISTS tenants;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS utilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS apartments;

-- Create apartments table
CREATE TABLE apartments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  total_rooms INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create rooms table
CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  room_type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  rent_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create tenants table
CREATE TABLE tenants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  id_card VARCHAR(20),
  contract_start DATE NOT NULL,
  contract_end DATE,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create bills table
CREATE TABLE bills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  billing_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create maintenance table
CREATE TABLE maintenance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create utilities table
CREATE TABLE utilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apartment_id INT NOT NULL,
  utility_name VARCHAR(100) NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (apartment_id) REFERENCES apartments(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create contracts table
CREATE TABLE contracts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tenant_id INT NOT NULL,
  room_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  terms TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create meter_readings table
CREATE TABLE meter_readings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  utility_id INT NOT NULL,
  reading_value DECIMAL(10, 2) NOT NULL,
  reading_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (utility_id) REFERENCES utilities(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  amount_paid DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(50) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create bill_items table
CREATE TABLE bill_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Payment requests (QR + slip upload)
CREATE TABLE payment_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  tenant_id INT NOT NULL,
  reference_code VARCHAR(50) NOT NULL UNIQUE,
  amount_expected DECIMAL(10, 2) NOT NULL,
  amount_reported DECIMAL(10, 2) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending_payment',
  slip_filename VARCHAR(255) NULL,
  slip_original_name VARCHAR(255) NULL,
  verified_at TIMESTAMP NULL,
  verified_by INT NULL,
  reject_reason VARCHAR(255) NULL,
  payment_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ========================================
-- Sample/Demo Data
-- ========================================

-- Insert demo users (รหัสผ่านทุกคน: 123456)
INSERT INTO users (name, email, password, role) VALUES 
('Admin', 'admin@dormitory.com', '$2a$10$i/qofLCE3fFpc.Ac0X3EbOFluoArj7vFgBCUnAnPjYtpRA4sPHtnq', 'admin'),
('เจ้าหน้าที่', 'staff@dormitory.com', '$2a$10$i/qofLCE3fFpc.Ac0X3EbOFluoArj7vFgBCUnAnPjYtpRA4sPHtnq', 'staff'),
('ผู้เช่า', 'tenant@dormitory.com', '$2a$10$i/qofLCE3fFpc.Ac0X3EbOFluoArj7vFgBCUnAnPjYtpRA4sPHtnq', 'tenant');

-- Insert apartments
INSERT INTO apartments (name, address, city, postal_code, total_rooms, description) VALUES 
('หอพักดอกไม้ 1', '123 ถนนสุขสวัสดิ์', 'กรุงเทพ', '10110', 20, 'หอพักหนึ่งห้องนอน'),
('หอพักดอกไม้ 2', '456 ถนนพหลโยธิน', 'กรุงเทพ', '10400', 15, 'หอพักสองห้องนอน');

-- Insert utilities
INSERT INTO utilities (apartment_id, utility_name, unit_price) VALUES 
(1, 'ไฟฟ้า (หน่วยละ)', 8.50),
(1, 'น้ำประปา (หน่วยละ)', 5.00),
(1, 'อินเตอร์เน็ต (เดือน)', 500.00),
(2, 'ไฟฟ้า (หน่วยละ)', 8.50),
(2, 'น้ำประปา (หน่วยละ)', 5.00),
(2, 'อินเตอร์เน็ต (เดือน)', 500.00);

-- Insert rooms
INSERT INTO rooms (apartment_id, room_number, room_type, capacity, rent_price, status) VALUES 
(1, 'A101', 'ห้องเดี่ยว', 1, 5000.00, 'occupied'),
(1, 'A102', 'ห้องเดี่ยว', 1, 5000.00, 'available'),
(1, 'A201', 'ห้องคู่', 2, 8000.00, 'occupied'),
(1, 'A202', 'ห้องคู่', 2, 8000.00, 'available'),
(2, 'B101', 'ห้องเดี่ยว', 1, 6000.00, 'occupied'),
(2, 'B102', 'ห้องเดี่ยว', 1, 6000.00, 'available'),
(2, 'B201', 'ห้องคู่', 2, 9000.00, 'occupied'),
(2, 'B202', 'ห้องคู่', 2, 9000.00, 'available');

-- Insert tenants
INSERT INTO tenants (room_id, name, phone, email, id_card, contract_start, contract_end, status) VALUES 
(1, 'นายสมชาย ใจดี', '0812345678', 'tenant@dormitory.com', '1234567890123', '2026-01-01', '2026-12-31', 'active'),
(3, 'นางสาวนิดดา สุขใจ', '0887654321', 'nidda@email.com', '9876543210987', '2026-02-15', '2027-02-15', 'active'),
(5, 'นายอนุชา วงศ์ทอง', '0898765432', 'anucha@email.com', '5555555555555', '2026-03-01', '2027-03-01', 'active'),
(7, 'นางสาวสิริ จันทร์สว่าง', '0867654321', 'siri@email.com', '6666666666666', '2026-04-01', '2027-04-01', 'active');

-- Insert contracts
INSERT INTO contracts (tenant_id, room_id, start_date, end_date, terms, status) VALUES 
(1, 1, '2026-01-01', '2026-12-31', 'ชำระค่าเช่าภายในวันที่ 5 ของเดือน', 'active'),
(2, 3, '2026-02-15', '2027-02-15', 'ชำระค่าเช่าภายในวันที่ 5 ของเดือน', 'active'),
(3, 5, '2026-03-01', '2027-03-01', 'ชำระค่าเช่าภายในวันที่ 5 ของเดือน', 'active'),
(4, 7, '2026-04-01', '2027-04-01', 'ชำระค่าเช่าภายในวันที่ 5 ของเดือน', 'active');

-- Insert bills
INSERT INTO bills (tenant_id, billing_date, due_date, amount, status, payment_date) VALUES 
(1, '2026-05-01', '2026-05-05', 5500.00, 'paid', '2026-05-03'),
(1, '2026-04-01', '2026-04-05', 5500.00, 'paid', '2026-04-04'),
(2, '2026-05-01', '2026-05-05', 8500.00, 'paid', '2026-05-02'),
(2, '2026-04-01', '2026-04-05', 8500.00, 'paid', '2026-04-05'),
(3, '2026-05-01', '2026-05-05', 6500.00, 'pending', NULL),
(4, '2026-05-01', '2026-05-05', 9500.00, 'pending', NULL);

-- Insert bill items
INSERT INTO bill_items (bill_id, description, quantity, unit_price, total) VALUES 
(1, 'ค่าเช่าห้อง', 1, 5000.00, 5000.00),
(1, 'ค่าไฟฟ้า', 50, 8.50, 425.00),
(1, 'ค่าน้ำประปา', 15, 5.00, 75.00),
(2, 'ค่าเช่าห้อง', 1, 5000.00, 5000.00),
(2, 'ค่าไฟฟ้า', 48, 8.50, 408.00),
(2, 'ค่าน้ำประปา', 18, 5.00, 90.00),
(3, 'ค่าเช่าห้อง', 1, 8000.00, 8000.00),
(3, 'ค่าไฟฟ้า', 60, 8.50, 510.00),
(3, 'ค่าน้ำประปา', -10, 5.00, -50.00),
(4, 'ค่าเช่าห้อง', 1, 8000.00, 8000.00),
(4, 'ค่าไฟฟ้า', 55, 8.50, 467.50),
(4, 'ค่าน้ำประปา', 16, 5.00, 80.00),
(5, 'ค่าเช่าห้อง', 1, 6000.00, 6000.00),
(5, 'ค่าไฟฟ้า', 52, 8.50, 442.00),
(5, 'ค่าน้ำประปา', 12, 5.00, 60.00),
(6, 'ค่าเช่าห้อง', 1, 9000.00, 9000.00),
(6, 'ค่าไฟฟ้า', 58, 8.50, 493.00),
(6, 'ค่าน้ำประปา', 14, 5.00, 70.00);

-- Insert payments
INSERT INTO payments (bill_id, payment_date, amount_paid, payment_method, status) VALUES 
(1, '2026-05-03 10:30:00', 5500.00, 'โอนเงิน', 'completed'),
(2, '2026-04-04 14:15:00', 5500.00, 'เงินสด', 'completed'),
(3, '2026-05-02 09:45:00', 8500.00, 'โอนเงิน', 'completed'),
(4, '2026-04-05 16:20:00', 8500.00, 'เงินสด', 'completed');

-- Insert meter readings
INSERT INTO meter_readings (room_id, utility_id, reading_value, reading_date) VALUES 
(1, 1, 1050.00, '2026-05-01'),
(1, 2, 315.00, '2026-05-01'),
(3, 1, 1200.00, '2026-05-01'),
(3, 2, 280.00, '2026-05-01'),
(5, 4, 1300.00, '2026-05-01'),
(5, 5, 240.00, '2026-05-01'),
(7, 4, 1450.00, '2026-05-01'),
(7, 5, 270.00, '2026-05-01');

-- Insert maintenance requests
INSERT INTO maintenance (apartment_id, description, status, created_date, completed_date) VALUES 
(1, 'ซ่อมหลอดไฟในห้อง A102', 'completed', '2026-04-28 08:00:00', '2026-04-28 14:30:00'),
(1, 'ท่อน้ำรั่วในห้องน้ำ A201', 'in-progress', '2026-05-20 09:15:00', NULL),
(2, 'ทำความสะอาดระบบแอร์ทั่วหอพัก', 'pending', '2026-05-21 10:00:00', NULL);
