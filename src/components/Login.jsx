import React, { useState, useRef } from 'react';
import UserTypeMenu from './UserTypeMenu';
import '../styles/Login.css';
import AuthContainer from './AuthFormContainer';
import { DownArrow, UpArrow } from './SVGs';
import authService from '../services/authService'

function Login({ onNavigateToRegister, onNavigateToForgot, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('User');
  const userMenuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login submit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setLoading(true);
    setError('');
    
    // Call the login API
    const response = await authService.login(email, password);
    
    // Extract user type from token
    const userData = authService.getCurrentUser();
    const userType = userData?.user_type;
    
    // Map backend user type to frontend representation if needed
    const userTypeMap = {
      'ADMIN': 'Admin',
      'STUDENT': 'Student',
      'SUPERVISOR': 'Supervisor',
      'CLIENT': 'Client'
    };
    
    // Pass user data and mapped user type to parent component
    onLogin(userData, userTypeMap[userType] || userType);
    
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific error responses from the server
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        setError('Invalid email or password');
      } else if (error.response.data && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError('Login failed. Please try again.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      setError('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      setError('Error occurred while logging in. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
  const handleUserTypeSelect = (type) => {
    setSelectedUserType(type);
    setIsUserMenuOpen(false);
  };

  return (
    <div className='login-wrapper'>
      <div className="roles-parent">
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
      </div>
      <AuthContainer>
      <div className="login-card">
      <div className="logo">CPMP</div>
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="options-row">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          
          <button 
            type="button" 
            className="text-button"
            onClick={onNavigateToForgot}
          >
            Forgot Password?
          </button>
        </div>
        
        <button type="submit" className="sign-in-button">Sign In</button>
        <button 
          type="button" 
          className="sign-up-button"
          onClick={onNavigateToRegister}
        >
          Sign Up
        </button>
      </form>
    </div>
    </AuthContainer>
    </div>
    
 
  );
}

export default Login;