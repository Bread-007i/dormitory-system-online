import { NavLink } from 'react-router-dom';
import { canAccessNav, navGroups } from '../config/navigation';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ collapsed, onNavigate }) {
  const { role } = useAuth();

  return (
    <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand px-3 py-3">
        <i className="bi bi-house-door-fill text-primary fs-4" />
        {!collapsed && (
          <div className="ms-2">
            <div className="fw-bold">หอพัก</div>
            <small className="text-muted opacity-75">ระบบจัดการ</small>
          </div>
        )}
      </div>
      <nav className="sidebar-nav px-2 pb-3">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter((item) =>
            canAccessNav(role, group, item)
          );
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.title} className="mb-2">
              {!collapsed && (
                <div className="sidebar-section px-2">{group.title}</div>
              )}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'active' : ''}`
                  }
                  onClick={onNavigate}
                  title={item.label}
                >
                  <i className={`bi ${item.icon}`} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
