import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 992) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  return (
    <div className={`app-shell ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      <Sidebar
        collapsed={sidebarCollapsed && !mobileOpen}
        onNavigate={() => setMobileOpen(false)}
      />
      {mobileOpen && (
        <div
          className="sidebar-backdrop d-lg-none"
          onClick={() => setMobileOpen(false)}
          role="presentation"
        />
      )}
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="app-content p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
