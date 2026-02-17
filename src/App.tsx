import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import AuthGuard from '@/components/AuthGuard';
import AppLayout from '@/components/AppLayout';
import LoginPage from '@/pages/Login';
import RegisterPage from '@/pages/Register';
import DashboardPage from '@/pages/Dashboard';
import PropertiesPage from '@/pages/Properties';
import WorkOrdersPage from '@/pages/WorkOrders';
import CreateWorkOrderPage from '@/pages/CreateWorkOrder';
import WorkOrderDetailPage from '@/pages/WorkOrderDetail';
import InvoicesPage from '@/pages/Invoices';
import CreateInvoicePage from '@/pages/CreateInvoice';
import InvoiceDetailPage from '@/pages/InvoiceDetail';
import SettingsPage from '@/pages/Settings';
import Spinner from '@/components/Spinner';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Protected routes */}
            <Route
              element={
                <AuthGuard>
                  <AppLayout />
                </AuthGuard>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/properties"
                element={
                  <AuthGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
                    <PropertiesPage />
                  </AuthGuard>
                }
              />
              <Route path="/work-orders" element={<WorkOrdersPage />} />
              <Route
                path="/work-orders/new"
                element={
                  <AuthGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
                    <CreateWorkOrderPage />
                  </AuthGuard>
                }
              />
              <Route path="/work-orders/:id" element={<WorkOrderDetailPage />} />
              <Route
                path="/invoices"
                element={
                  <AuthGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
                    <InvoicesPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/invoices/new"
                element={
                  <AuthGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
                    <CreateInvoicePage />
                  </AuthGuard>
                }
              />
              <Route
                path="/invoices/:id"
                element={
                  <AuthGuard allowedRoles={['ADMIN', 'PROPERTY_MANAGER']}>
                    <InvoiceDetailPage />
                  </AuthGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthGuard allowedRoles={['ADMIN']}>
                    <SettingsPage />
                  </AuthGuard>
                }
              />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </HashRouter>
  );
}
