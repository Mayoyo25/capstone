import React, { useState, useRef } from 'react';
import UserTypeMenu from './UserTypeMenu';
import '../styles/Login.css';
import AuthContainer from './AuthFormContainer';
import { DownArrow, UpArrow } from './SVGs';

function Login({ onNavigateToRegister, onNavigateToForgot, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState('User');
  const userMenuRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically make an API call to verify credentials
    // For this example, we'll just simulate a successful login
    const userData = { email };
    onLogin(userData, selectedUserType);
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