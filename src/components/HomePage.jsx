import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import LogoutButton from './LogoutButton';

const HomePage = () => {
  const { userData, logout } = useAuthStore();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative'>
      <header className='absolute top-0 left-0 right-0 p-6 flex justify-end'>
        <LogoutButton logout={logout} />
      </header>

      <div className='flex flex-col items-center justify-center h-screen text-center px-4 space-y-8'>
        <div className='space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-800'>
            Welcome back,{' '}
            <span className='text-[#4ecdc4]'>{userData?.name || 'User'}</span>
          </h1>
          <p className='text-gray-600 text-lg'>
            Ready to continue your journey?
          </p>
        </div>
        <Link
          to='/dashboard'
          className='
            px-8 py-3
            bg-[#4ecdc4] hover:bg-[#3aa89f]
            text-white font-semibold
            rounded-lg
            shadow-md hover:shadow-lg
            transition-all
            transform hover:scale-105
            active:scale-95
          '
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
