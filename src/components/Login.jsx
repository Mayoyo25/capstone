import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { VALID_USER_TYPES, mapUserTypeToFrontend } from '../utils/userTypeUtils';
import '../styles/Login.css';
import UserTypeMenu from './UserTypeMenu';
import { DownArrow, UpArrow } from './SVGs';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import LoginForm from './LoginForm';

function Login() {
  const navigate = useNavigate();

  // Global state (necessary for login logic)
  const { user, selectedUserType, isUserMenuOpen, setSelectedUserType, setIsUserMenuOpen, login, resetState } =
    useAuthStore();

  // Local state for form inputs
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState(user.password || '');
  const [rememberMe, setRememberMe] = useState(user.rememberMe || false);
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset previous state
    resetState();
    setError('');

    // Validate user type
    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('Please select a role');
      return;
    }

    try {
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
      console.error('Login error:', loginError);

      // Detailed error handling
      let errorMessage = 'Error occurred while logging in. Please try again.';

      if (loginError.response) {
        if (loginError.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (loginError.response.data && loginError.response.data.detail) {
          errorMessage = loginError.response.data.detail;
        }
      } else if (loginError.request) {
        errorMessage = 'No response from server. Please check your connection.';
      }

      // Set the error locally
      setError(errorMessage);
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
          navigate={navigate}
        />
      </div>
    </AuthPageWrapper>
  );
}

export default Login;