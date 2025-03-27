import React from 'react';
import useAuthStore from '../stores/authStore';

const HomePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-screen w-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Welcome, {user.fullName || 'User'}
        </h1>
        <LogoutButton logout={logout}/>
      </header>
    </div>
  );
};

export default HomePage;