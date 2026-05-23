import { Navigate, useLocation } from 'react-router-dom';
import CrudPage from '../components/CrudPage';
import { resources } from '../config/resources';
import { useAuth } from '../context/AuthContext';

export default function ResourcePage() {
  const { pathname } = useLocation();
  const resourceKey = pathname.split('/').filter(Boolean)[0];
  const { user } = useAuth();
  const config = resources[resourceKey];

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const normalizedRole = user?.role === 'manager' ? 'staff' : user?.role;
  if (config.roles && !config.roles.includes(normalizedRole)) {
    return <Navigate to="/" replace />;
  }

  return <CrudPage config={config} />;
}
