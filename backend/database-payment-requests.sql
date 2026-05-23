-- ระบบชำระเงิน QR + อัปโหลดสลิป
USE dormitory_system;

CREATE TABLE IF NOT EXISTS payment_requests (
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
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_payment_requests_status (status),
  INDEX idx_payment_requests_ref (reference_code)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
