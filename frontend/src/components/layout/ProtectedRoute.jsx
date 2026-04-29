import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { DASHBOARD_BY_ROLE } from '../../constants/app';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, token } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#030303]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={DASHBOARD_BY_ROLE[user?.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
