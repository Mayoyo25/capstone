import React from 'react';
import '../styles/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import DashboardUserType from './DashboardUserType';

function Dashboard() {
    const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { email, userType } = user;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className="dashboard">
      <header>
        <div className="logo">CPMP</div>
        <div className="user-info">
          <span>{email}</span>
          <span className="user-type-badge">{userType}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </header>
      
      <main>
        <h1>Welcome to the {userType} Dashboard</h1>
        <p>This is a placeholder for the {userType.toLowerCase()} dashboard content.</p>
        {userType && <DashboardUserType userType={userType}/>}
      </main>
    </div>
  );
}

export default Dashboard;