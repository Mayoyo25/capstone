import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { VALID_USER_TYPES } from '../utils/userTypeUtils';
import { LoaderPinwheel } from 'lucide-react';

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true); // Loading state while checking user session
  const [isValidUser, setIsValidUser] = useState(false); // Whether the user is valid

  const isDev = import.meta.env.MODE === 'development';

  useEffect(() => {
    // Function to check if the user is authenticated and has a valid user type
    const checkAuth = async () => {
      try {
        // Call an endpoint to validate the session (e.g., `/api/current-user/`)
        const response = await authService.axiosInstance.get('/current-user/');
        const user = response.data;

        // Check if the user type is valid
        if (VALID_USER_TYPES.includes(user.user_type)) {
          setIsValidUser(true);
        } else {
          setIsValidUser(false);
        }
      } catch (error) {
        // If the session is invalid or there's an error, redirect to login
        setIsValidUser(false);
      } finally {
        setIsLoading(false); // Stop loading once the check is complete
      }
    };

    checkAuth();
  }, []);

  // Show a loading indicator while checking authentication
  if (isLoading) {
    return (
      <div className='flex justify-center items-center w-screen h-screen space-x-3'>
        <p className='text-lg'>Loading...</p>
        <LoaderPinwheel className='animate-spin' />
      </div>
    );
  }

  // Redirect to login if the user is not valid
  // Or if you want to bypass auth in development, you could do:
  if (!isValidUser) {
    return <Navigate to='/login' replace />;
  }

  console.log(isValidUser);

  // Render the protected content if the user is valid
  return <Outlet />;
};

export default ProtectedRoute;
