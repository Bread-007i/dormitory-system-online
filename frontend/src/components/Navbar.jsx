import { Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  admin: 'ผู้ดูแลระบบ',
  staff: 'เจ้าหน้าที่',
  tenant: 'ผู้เช่า',
};

export default function Navbar({ onToggleSidebar }) {
  const { user, logout, role } = useAuth();

  return (
    <header className="app-navbar border-bottom bg-white px-3 py-2 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-2">
        <Button variant="outline-secondary" size="sm" onClick={onToggleSidebar}>
          <i className="bi bi-list" />
        </Button>
        <span className="text-muted d-none d-md-inline">ระบบจัดการหอพัก</span>
      </div>
      <Dropdown align="end">
        <Dropdown.Toggle variant="light" id="user-menu" className="d-flex align-items-center gap-2">
          <i className="bi bi-person-circle fs-5" />
          <span className="d-none d-sm-inline">{user?.name}</span>
          <span className="badge bg-primary-subtle text-primary">
            {ROLE_LABELS[role] || role}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.ItemText>
            <small className="text-muted">{user?.email}</small>
          </Dropdown.ItemText>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>
            <i className="bi bi-box-arrow-right me-2" />
            ออกจากระบบ
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </header>
  );
}
