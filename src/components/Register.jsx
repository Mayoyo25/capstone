import React, { useState, useRef, useEffect } from 'react';
import UserTypeMenu from './UserTypeMenu';
import '../styles/Register.css';
import AuthContainer from './AuthFormContainer';
import { DownArrow, UpArrow } from './SVGs';
import authService from '../services/authService'

const VALID_USER_TYPES = ['Admin', 'Student', 'Supervisor', 'Client'];

function Register({ onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('Select Role');
  const [roleError, setRoleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userMenuRef = useRef(null);

  // Reset error when user changes selection
 useEffect(() => {
    if (roleError && VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('');
    }
  }, [selectedUserType, roleError]);

  const register = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Parse the full name into first and last name
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Generate a username from email if needed
      const username = email.split('@')[0];
      
      // Map the UI user type to Django's expected format
      const userTypeMap = {
        'Admin': 'ADMIN',
        'Student': 'STUDENT',
        'Supervisor': 'SUPERVISOR',
        'Client': 'CLIENT'
      };
      
      // Create the user data object
      const userData = {
        username: username,
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        password2: confirmPassword,
        user_type: userTypeMap[selectedUserType]
      };
      
      // Send the registration request
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      // Handle different types of errors
      if (error.response && error.response.data) {
        // Extract error messages from the response
        const errorData = error.response.data;
        let errorMsg = '';
        
        // Django REST Framework returns errors in different formats
        if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (typeof errorData === 'object') {
          // Combine all error messages
          errorMsg = Object.keys(errorData)
            .map(key => `${key}: ${errorData[key].join(' ')}`)
            .join('\n');
        }
        
        setErrorMessage(errorMsg || 'Registration failed');
      } else {
        setErrorMessage('Network error. Please try again later.');
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrorMessage('');
    setRoleError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match!");
      return;
    }

    // Validate role selection
    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('Please select a role');
      return;
    }
   
    try {
      await register();
      // Show success message
      alert('Registration successful! Please login.');
      onNavigateToLogin();
    } catch (error) {
      // Error is already handled in the register function
      console.error('Registration error:', error);
    }
  };
  
  const handleUserTypeSelect = (type) => {
    // Only allow setting to valid user types
    if (VALID_USER_TYPES.includes(type)) {
      setSelectedUserType(type);
      setRoleError('');
    }
    setIsUserMenuOpen(false);
  };
  
  return (
    <AuthContainer>
      <div className="register-card">
        <div className="logo">CPMP</div>
        <h2>Register</h2>

        {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
       
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
          onClick={onNavigateToLogin}
          disabled={loading}
        >
          Back to Login
        </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default Register;