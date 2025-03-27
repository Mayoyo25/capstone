import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';
import useAuthStore from './stores/authStore';

function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Root Path Conditional Rendering */}
        <Route 
          path="/" 
          element={isAuthenticated ? <HomePage /> : <LandingPage />} 
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<LandingPage />} />

        {/* For Development*/}
        <Route path="/test" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;