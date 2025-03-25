import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import authService from '../services/authService';

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;