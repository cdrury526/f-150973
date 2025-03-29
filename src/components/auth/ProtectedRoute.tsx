
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    // You could render a loading indicator here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check role requirements if specified
  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    // User doesn't have the required role
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
