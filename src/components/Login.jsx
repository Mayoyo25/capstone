import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import '../styles/Login.css';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import LoginForm from '../forms/LoginForm';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  VALID_USER_TYPES,
  mapUserTypeToFrontend,
} from '../utils/userTypeUtils';

function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Select Role');
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (initialCheckDone) return;

    const currentUser = authService.getCurrentUser();

    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }

    setInitialCheckDone(true);
  }, [navigate, initialCheckDone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRoleError('');

    if (selectedRole === 'Select Role') {
      setRoleError('Please select your role');
      return;
    }

    setLoading(true);

    try {
      await authService.login(email, password);
      const userData = authService.getCurrentUser();

      if (!userData) {
        throw new Error('Login failed - no user data received');
      }

      const userType = userData?.user_type;
      const frontendUserType = mapUserTypeToFrontend(userType);

      if (selectedRole !== frontendUserType) {
        authService.logout(); // Clear invalid session
        throw new Error("You don't have permission to access this role");
      }
      login(userData);
      navigate('/dashboard', { replace: true });
    } catch (loginError) {
      console.error('Login Error:', loginError.message);
      let errorMessage = 'Error occurred while logging in. Please try again.';

      if (loginError.message === 'Invalid credentials.') {
        errorMessage = 'Invalid email or password.';
      } else if (loginError.message.includes('server')) {
        errorMessage = 'No response from server. Please check your connection.';
      } else if (loginError.message.includes('permission')) {
        errorMessage = loginError.message;
      }

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
      <div className='fixed top-6 right-6 z-50 group'>
        <div className='dropdown dropdown-hover dropdown-end'>
          <div
            tabIndex={0}
            className='btn rounded-lg m-1 flex items-center gap-2'
          >
            {selectedRole}
            <ChevronDown className='group-hover:hidden' size={18} />
            <ChevronUp className='hidden group-hover:inline-block' size={18} />
          </div>

          <ul className='dropdown-content menu bg-base-100 rounded-box w-52 shadow'>
            {VALID_USER_TYPES.map((type) => (
              <li key={type} onClick={() => handleSelect(type)}>
                <a className='hover:bg-gray-100 active:bg-gray-200'>
                  {mapUserTypeToFrontend(type)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='w-full h-full'>
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
