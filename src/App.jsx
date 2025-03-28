import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';
import useAuthStore from './stores/authStore';
import TestPage from './TestPage'

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
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App;