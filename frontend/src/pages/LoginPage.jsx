import { useState } from 'react';
import { Alert, Button, Col, Form, Row, Spinner } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100">
      <Row className="g-0 min-vh-100">
        <Col
          lg={6}
          className="d-none d-lg-flex login-hero flex-column justify-content-center p-5"
        >
          <div className="login-hero-inner">
            <i className="bi bi-buildings login-hero-icon" />
            <h2 className="fw-bold mb-3">ระบบจัดการหอพัก</h2>
            <p className="login-hero-text mb-0">
              จัดการห้องพัก ผู้เช่า ใบแจ้งหนี้ และการชำระเงินในที่เดียว
            </p>
          </div>
        </Col>
        <Col
          lg={6}
          className="d-flex align-items-center justify-content-center p-4 p-md-5"
        >
          <div className="login-form-wrap w-100">
            <div className="text-center text-lg-start mb-4">
              <i className="bi bi-house-door-fill text-primary d-lg-none display-6 mb-2" />
              <h1 className="h3 fw-bold mb-1">เข้าสู่ระบบ</h1>
              <p className="text-muted mb-0">กรุณาใช้บัญชีที่ได้รับจากผู้ดูแลระบบ</p>
            </div>

            {error && (
              <Alert variant="danger" className="py-2">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-3">
                <Form.Label>อีเมล</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>รหัสผ่าน</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link login-toggle-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  'เข้าสู่ระบบ'
                )}
              </Button>
            </Form>

            <p className="text-center text-muted small mt-4 mb-0">
              หากลืมรหัสผ่าน กรุณาติดต่อเจ้าหน้าที่หอพัก
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}
