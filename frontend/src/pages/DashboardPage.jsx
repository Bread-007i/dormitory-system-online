import { useEffect, useState } from 'react';
import { Alert, Card, Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api, { unwrapList } from '../api/client';
import PageHeader from '../components/PageHeader';
import RoomFloorPlan from '../components/RoomFloorPlan';
import { useAuth } from '../context/AuthContext';
import { formatCell } from '../utils/format';
import { getErrorMessage } from '../utils/errors';

const staffStats = [
  { key: 'apartments', label: 'หอพัก', icon: 'bi-building', path: '/apartments', endpoint: '/apartments' },
  { key: 'rooms', label: 'ห้องพัก', icon: 'bi-door-open', path: '/rooms', endpoint: '/rooms' },
  { key: 'tenants', label: 'ผู้เช่า', icon: 'bi-people', path: '/tenants', endpoint: '/tenants' },
  { key: 'bills', label: 'ใบแจ้งหนี้', icon: 'bi-receipt', path: '/bills', endpoint: '/bills' },
  { key: 'maintenance', label: 'แจ้งซ่อม', icon: 'bi-tools', path: '/maintenance', endpoint: '/maintenance' },
  { key: 'payments', label: 'การชำระ', icon: 'bi-cash-coin', path: '/payments', endpoint: '/payments' },
];

function StaffDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        staffStats.map(async (s) => {
          try {
            const res = await api.get(s.endpoint);
            return [s.key, unwrapList(res).length];
          } catch {
            return [s.key, 0];
          }
        })
      );
      setStats(Object.fromEntries(results));
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-3">กำลังโหลดสถิติและมุมมองห้องพัก...</p>
      </div>
    );
  }

  return (
    <>
      <Row className="g-3 mb-4">
        {staffStats.map((s) => (
          <Col key={s.key} xs={12} sm={6} lg={4}>
            <Card className="stat-card border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">{s.label}</div>
                  <div className="display-6 fw-bold">{stats[s.key] ?? 0}</div>
                  <Link to={s.path} className="small">
                    ดูรายละเอียด →
                  </Link>
                </div>
                <div className="stat-icon rounded-circle">
                  <i className={`bi ${s.icon}`} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Room Floor Plan */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light fw-semibold">
          <i className="bi bi-door-open me-2"></i>
          มุมมองห้องพัก
        </Card.Header>
        <Card.Body>
          <RoomFloorPlan />
        </Card.Body>
      </Card>
    </>
  );
}

function TenantDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/portal/overview')
      .then((res) => setData(res.data.data))
      .catch((err) => {
        if (err.response?.status === 429) {
          setError('กำลังโหลดข้อมูล กรุณารอสักครู่...');
        } else {
          setError(getErrorMessage(err));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="text-muted mt-3">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) return <Alert variant={error.includes('กำลังโหลด') ? 'warning' : 'danger'}>{error}</Alert>;

  const { tenant, stats, bills } = data;

  return (
    <>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-1">สวัสดี, {tenant.name}</h5>
          <p className="text-muted mb-0">
            ห้อง {tenant.room_number} — {tenant.apartment_name}
          </p>
        </Card.Body>
      </Card>
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">บิลทั้งหมด</div>
              <div className="h3 fw-bold">{stats.totalBills}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">รอชำระ</div>
              <div className="h3 fw-bold text-warning">{stats.pendingBills}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">การชำระแล้ว</div>
              <div className="h3 fw-bold">{stats.totalPayments}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={6} lg={3}>
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="text-muted small">แจ้งซ่อม</div>
              <div className="h3 fw-bold">{stats.maintenanceRequests}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white fw-semibold">บิลล่าสุด</Card.Header>
        <Card.Body className="p-0">
          <ul className="list-group list-group-flush">
            {(bills || []).slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  #{b.id} — ครบ {formatCell(b.due_date, 'date')}
                </span>
                <span>
                  {formatCell(b.amount, 'currency')}{' '}
                  <span className="badge bg-secondary">{b.status}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="p-3">
            <Link to="/my-bills">ดูใบแจ้งหนี้ทั้งหมด →</Link>
          </div>
        </Card.Body>
      </Card>
    </>
  );
}

export default function DashboardPage() {
  const { isTenant, isAdmin } = useAuth();

  return (
    <>
      <PageHeader
        title="แดชบอร์ด"
        subtitle={
          isTenant
            ? 'ภาพรวมห้องและการเงินของคุณ'
            : isAdmin
              ? 'ภาพรวมระบบทั้งหมด'
              : 'ภาพรวมงานประจำวัน'
        }
        icon="bi-speedometer2"
      />
      {isTenant ? <TenantDashboard /> : <StaffDashboard />}
    </>
  );
}
