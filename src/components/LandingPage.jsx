import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <main className='flex items-center justify-center text-center w-screen h-screen'>
      <div className='max-w-2xl space-y-6'>
        <h1 className='text-5xl font-extrabold tracking-tight text-gray-900 leading-tight'>
          Simplify Your Workflow
        </h1>
        <p className='text-xl text-gray-600 leading-relaxed'>
          Streamline your team's processes with intelligent tools designed to
          boost productivity and collaboration.
        </p>
        <div className='flex items-center justify-center space-x-6'>
          <Link
            to='/login'
            className='
                inline-block
                px-6 py-3
                border-2 border-[#4ecdc4]
                text-[#4ecdc4] hover:text-white
                bg-transparent hover:bg-[#4ecdc4]
                font-medium
                rounded-lg
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] focus:ring-opacity-50
                active:scale-95
                text-center
              '
          >
            Login
          </Link>
          <Link
            to='/register'
            className='
            inline-block
            px-6 py-3
            bg-[#4ecdc4] hover:bg-[#3aa89f]
            text-white font-medium
            rounded-lg
            shadow-md hover:shadow-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-[#4ecdc4] focus:ring-opacity-50
            active:scale-95
            text-center
          '
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
};

export default LandingPage;
