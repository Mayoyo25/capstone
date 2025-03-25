import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import Dashboard from '../components/Dashboard';
import '../styles/AuthPage.css';

function AuthPage() {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const handleLogin = (userData, type) => {
    setUser(userData);
    setUserType(type);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    setCurrentView('login');
  };

  return (
    <div className="auth-page">
      {!user ? (
         <> 
         {currentView === 'login' && (
            <Login 
              onNavigateToRegister={() => setCurrentView('register')}
              onNavigateToForgot={() => setCurrentView('forgot')}
              onLogin={handleLogin}
            />
          )}
          {currentView === 'register' && (
            <Register 
              onNavigateToLogin={() => setCurrentView('login')}
            />
          )}
          {currentView === 'forgot' && (
            <ForgotPassword 
              onNavigateToLogin={() => setCurrentView('login')}
            />
          )}
          </>
      ) : (
        <Dashboard 
          user={user} 
          userType={userType} 
          onLogout={handleLogout} 
        />
      )}
    </div>
  );
}

export default AuthPage;