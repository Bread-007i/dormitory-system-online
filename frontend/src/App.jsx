import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ResourcePage from './pages/ResourcePage';
import MyBillsPage from './pages/tenant/MyBillsPage';
import MyMaintenancePage from './pages/tenant/MyMaintenancePage';
import MyPaymentsPage from './pages/tenant/MyPaymentsPage';
import MyRoomPage from './pages/tenant/MyRoomPage';
import PayBillPage from './pages/tenant/PayBillPage';
import PaymentVerifyPage from './pages/PaymentVerifyPage';

const staffRoutes = [
  'apartments',
  'rooms',
  'tenants',
  'bills',
  'maintenance',
  'utilities',
  'contracts',
  'meter-readings',
  'payments',
  'bill-items',
];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />

            <Route element={<ProtectedRoute roles={['admin', 'staff']} />}>
              {staffRoutes.map((key) => (
                <Route key={key} path={key} element={<ResourcePage />} />
              ))}
              <Route path="payment-verify" element={<PaymentVerifyPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="users" element={<ResourcePage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['tenant']} />}>
              <Route path="my-room" element={<MyRoomPage />} />
              <Route path="my-bills" element={<MyBillsPage />} />
              <Route path="my-payments" element={<MyPaymentsPage />} />
              <Route path="my-maintenance" element={<MyMaintenancePage />} />
              <Route path="pay/:billId" element={<PayBillPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
