import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  
  console.log('ProtectedRoute Authentication Check:', {
    isAuthenticated,
    userEmail: user?.email
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;