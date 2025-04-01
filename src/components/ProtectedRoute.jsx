import { Navigate, Outlet } from 'react-router-dom';
import { LoaderPinwheel } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuthStore();

  useEffect(() => {
    // Additional verification can be done here if needed
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-screen h-screen space-x-3'>
        <p className='text-lg'>Loading...</p>
        <LoaderPinwheel className='animate-spin' />
      </div>
    );
  }

  if (!userData) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
