import React, { useState, useRef, useEffect } from 'react';
import UserTypeMenu from './UserTypeMenu';
import '../styles/Register.css';
import AuthContainer from './AuthFormContainer';
import { DownArrow, UpArrow } from './SVGs';

const VALID_USER_TYPES = ['Admin', 'Student', 'Supervisor', 'Client'];

function Register({ onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('Select Role');
  const [roleError, setRoleError] = useState('');
  const userMenuRef = useRef(null);

  // Reset error when user changes selection
  useEffect(() => {
    if (roleError && VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('');
    }
  }, [selectedUserType, roleError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Validate role selection
    if (!VALID_USER_TYPES.includes(selectedUserType)) {
      setRoleError('Please select a role');
      return;
    }
   
    // Here you'd typically make an API call to register the user
    // For this example, we'll just simulate a successful registration
    alert(`Registration successful as ${selectedUserType}! Please login.`);
    onNavigateToLogin();
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
         
          <div className="user-type-container" ref={userMenuRef}>
            <button
              type="button"
              className={`user-type-button ${roleError ? 'error' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              {selectedUserType}
              {isUserMenuOpen ? <UpArrow /> : <DownArrow />}
            </button>
            
            {roleError && <div className="error-message">{roleError}</div>}
           
            {isUserMenuOpen && (
              <UserTypeMenu
                onSelect={handleUserTypeSelect}
                closeMenu={() => setIsUserMenuOpen(false)}
                userTypes={VALID_USER_TYPES}
              />
            )}
          </div>
         
          <button type="submit" className="register-button">Register</button>
          <button
            type="button"
            className="back-to-login-button"
            onClick={onNavigateToLogin}
          >
            Back to Login
          </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default Register;