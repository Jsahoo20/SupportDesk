import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import EmployeeDashboard from '../pages/EmployeeDashboard';
import SupportDashboard from '../pages/SupportDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CreateTicket from '../pages/CreateTicket';
import TicketDetails from '../pages/TicketDetails';
import AdminPanel from '../pages/AdminPanel';
import AdminTickets from '../pages/AdminTickets';

const protectedPage = (page, allowedRoles) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <MainLayout>{page}</MainLayout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected: Employee */}
      <Route
        path="/dashboard"
        element={protectedPage(<EmployeeDashboard />, ['Employee'])}
      />
      <Route
        path="/tickets/create"
        element={protectedPage(<CreateTicket />, ['Employee'])}
      />

      {/* Protected: Support */}
      <Route
        path="/support"
        element={protectedPage(<SupportDashboard />, ['Support'])}
      />

      {/* Protected: Admin */}
      <Route
        path="/admin"
        element={protectedPage(<AdminDashboard />, ['Admin'])}
      />
      <Route
        path="/admin/panel"
        element={protectedPage(<AdminPanel />, ['Admin'])}
      />
      <Route
        path="/admin/tickets"
        element={protectedPage(<AdminTickets />, ['Admin'])}
      />

      {/* Protected: All Auth Users */}
      <Route
        path="/tickets/:id"
        element={protectedPage(<TicketDetails />)}
      />

      {/* Home Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
