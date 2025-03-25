import React, { useState, useEffect, useRef } from 'react';
import { VALID_USER_TYPES, mapUserTypeToBackend } from '../utils/userTypeUtils';
import '../styles/Register.css';
import AuthContainer from './AuthFormContainer';
import UserTypeMenu from './UserTypeMenu';
import { DownArrow, UpArrow } from './SVGs';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import AuthPageWrapper from './AuthPageWrapper';

function Register() {
  const navigate = useNavigate();

  // Local state for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('Select Role');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userMenuRef = useRef(null);

  // Reset form state
  const resetState = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setSelectedUserType('Select Role');
    setRoleError('');
    setError('');
  };

  // Clear role error if a valid role is selected
  useEffect(() => {
    if (roleError && VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('');
    }
  }, [selectedUserType, roleError]);

  // Handle registration logic
  const register = async () => {
    try {
      setLoading(true);
      setError('');

      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const username = email.split('@')[0];

      const userData = {
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2: confirmPassword,
        user_type: mapUserTypeToBackend(selectedUserType),
      };
      console.log(userData);
      
      await authService.register(userData);
    } catch (error) {
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        let errorMsg = '';

        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (typeof errorData === 'object') {
          errorMsg = Object.keys(errorData)
            .map((key) => `${key}: ${errorData[key].join(' ')}`)
            .join('\n');
        }

        setError(errorMsg || 'Registration failed');
      } else {
        setError('Network error. Please try again later.');
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('Please select a valid role');
      return;
    }

    try {
      await register();
      resetState();
      navigate('/login');
    } catch (err) {
      console.error('Registration failed', err);
    }
  };

  // Handle user type selection
  const handleUserTypeSelect = (type) => {
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedUserType(type);
    }
    setIsUserMenuOpen(false);
  };

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <div className="register-card">
          <div className="logo">CPMP</div>
          <h2>Register</h2>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>

            <div className={`user-type-container ${roleError ? 'error' : ''}`} ref={userMenuRef}>
              <button
                type="button"
                className={`user-type-button ${roleError ? 'error' : ''}`}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                {selectedUserType}
                {isUserMenuOpen ? <UpArrow /> : <DownArrow />}
              </button>

              {roleError && <div className="role-error">{roleError}</div>}

              {isUserMenuOpen && (
                <UserTypeMenu
                  onSelect={handleUserTypeSelect}
                  closeMenu={() => setIsUserMenuOpen(false)}
                  options={VALID_USER_TYPES}
                />
              )}
            </div>

            <button
              type="submit"
              className={`register-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            <button
              type="button"
              className="back-to-login-button"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
}

export default Register;