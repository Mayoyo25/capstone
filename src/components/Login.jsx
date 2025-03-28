import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import '../styles/Login.css';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import LoginForm from '../forms/LoginForm';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VALID_USER_TYPES, mapUserTypeToFrontend } from '../utils/userTypeUtils';


function Login() {
  const navigate = useNavigate();

  // Global state (necessary for login logic)
  const { user,  login } = useAuthStore();

  // Local state for form inputs
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState(user.password || '');
  const [rememberMe, setRememberMe] = useState(user.rememberMe || false);
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Select Role');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('Current User Check:', currentUser);

    if (currentUser) {
      console.log('Redirecting to dashboard due to existing user');
      navigate('/dashboard');
    }

    return () => {
      console.log('Login Component Unmounting');
      console.groupEnd();
    };
  }, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset previous state
  setError('');
  setRoleError('');
  
  // Validate role selection
  if (selectedRole === 'Select Role') {
    setRoleError('Please select a role');
    return;
  }

  setLoading(true); // Set loading to true

  try {
    // Perform login
    await authService.login(email, password);

    // Fetch user data
    const userData = authService.getCurrentUser();
    const userType = userData?.user_type;
    const frontendUserType = mapUserTypeToFrontend(userType);

    // Verify the selected role matches the user's actual role
    if (selectedRole !== frontendUserType) {
      throw new Error("You don't have permission to access this role");
    }

    // Update login state in the global store
    login(userData, frontendUserType);

    // Navigate to dashboard
    navigate('/dashboard');
  } catch (loginError) {
    console.error('Login Error:', loginError.message);

    // Detailed error handling
    let errorMessage = 'Error occurred while logging in. Please try again.';

    if (loginError.message === 'Invalid credentials.') {
      errorMessage = 'Invalid email or password.';
    } else if (loginError.message === 'No response from server. Please check your connection.') {
      errorMessage = 'No response from server. Please check your connection.';
    } else if (loginError.message === "You don't have permission to access this role") {
      errorMessage = loginError.message;
    } else {
      errorMessage = 'An unexpected error occurred.';
    }

    // Set the error locally
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
const handleSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedRole(mapUserTypeToFrontend(type));
    }
  };

  return (
    <AuthPageWrapper>
      <div className="fixed top-6 right-6 z-50 group">
        <div className="dropdown dropdown-hover dropdown-end">
          <div tabIndex={0} className="btn rounded-lg m-1 flex items-center gap-2">
            {selectedRole}
            <ChevronDown className="group-hover:hidden" size={18} />
            <ChevronUp className="hidden group-hover:inline-block" size={18} />
          </div>
          
          <ul className="dropdown-content menu bg-base-100 rounded-box w-52 shadow">
            {VALID_USER_TYPES.map((type) => (
              <li key={type} onClick={() => handleSelect(type)}>
                <a className="hover:bg-gray-100 active:bg-gray-200">
                  {mapUserTypeToFrontend(type)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full h-full">
        <LoginForm
          roleError={roleError}
          handleSubmit={handleSubmit}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          error={error}
          loading={loading}
          navigate={navigate}
        />
      </div>
    </AuthPageWrapper>
  );
}

export default Login;