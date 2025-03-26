import React from 'react';
import useAuthStore from '../stores/authStore';

const HomePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user.fullName || 'User'}
        </h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </header>
    </div>
  );
};

export default HomePage;