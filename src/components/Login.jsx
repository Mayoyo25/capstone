import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { VALID_USER_TYPES, mapUserTypeToFrontend } from '../utils/userTypeUtils';
import '../styles/Login.css';
import UserTypeMenu from './UserTypeMenu';
import { DownArrow, UpArrow } from './SVGs';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import LoginForm from '../forms/LoginForm';

function Login() {
  const navigate = useNavigate();

  // Global state (necessary for login logic)
  const { user, selectedUserType, isUserMenuOpen, setSelectedUserType, setIsUserMenuOpen, login } =
    useAuthStore();

  // Local state for form inputs
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState(user.password || '');
  const [rememberMe, setRememberMe] = useState(user.rememberMe || false);
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);

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
  console.log('Before preventDefault'); // Debugging log
  e.preventDefault();
  console.log('After preventDefault');

  // Reset previous state
  setError('');
  setRoleError('');
  setLoading(true); // Set loading to true

  try {
    // Validate user type
    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('Please select a role');
      setLoading(false); // Reset loading state
      return;
    }

    // Perform login
    await authService.login(email, password);

    // Fetch user data
    const userData = authService.getCurrentUser();
    const userType = userData?.user_type;
    const frontendUserType = mapUserTypeToFrontend(userType);

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
    } else {
      errorMessage = 'An unexpected error occurred.';
    }

    // Set the error locally
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleUserTypeSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedUserType(type);
    }
    setIsUserMenuOpen(false);
  };

  return (
    <AuthPageWrapper>
      <div className="login-wrapper">
        <div className="roles-parent">
          <div className="user-type-container">
            <button
              type="button"
              className="user-type-button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {selectedUserType}
              {isUserMenuOpen ? <UpArrow /> : <DownArrow />}
            </button>
            {isUserMenuOpen && (
              <UserTypeMenu
                onSelect={handleUserTypeSelect}
                closeMenu={() => setIsUserMenuOpen(false)}
              />
            )}
          </div>
        </div>
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
          loading={loading} // Pass loading state to LoginForm
          navigate={navigate}
        />
      </div>
    </AuthPageWrapper>
  );
}

export default Login;



