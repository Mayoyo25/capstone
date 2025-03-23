import React, { useState, useRef } from 'react';
import UserTypeMenu from './UserTypeMenu';
import '../styles/Register.css';
import AuthContainer from './AuthFormContainer';
import { DownArrow, UpArrow } from './SVGs';

function Register({ onNavigateToLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('User');
  const userMenuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
   
    // Here you'd typically make an API call to register the user
    // For this example, we'll just simulate a successful registration
    alert(`Registration successful as ${selectedUserType}! Please login.`);
    onNavigateToLogin();
  };

  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
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