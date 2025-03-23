import React, { useState } from 'react';
import '../styles/ForgotPassword.css';
import AuthContainer from './AuthFormContainer';

function ForgotPassword({ onNavigateToLogin }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically make an API call to send a reset email
    // For this example, we'll just simulate a successful submission
    setIsSubmitted(true);
  };

  return (
    <AuthContainer>
    <div className="forgot-password-card">
      <div className="logo">CPMP</div>
      <h2>Forgot Password</h2>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit}>
          <p>Enter your email address to receive password reset instructions</p>
          
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
          </div>
          
          <button type="submit" className="reset-button">Send Reset Link</button>
          <button 
            type="button" 
            className="back-to-login-button"
            onClick={onNavigateToLogin}
          >
            Back to Login
          </button>
        </form>
      ) : (
        <div className="success-message">
          <p>Password reset link has been sent to your email address.</p>
          <button 
            className="back-to-login-button"
            onClick={onNavigateToLogin}
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
    </AuthContainer>
  );
}

export default ForgotPassword;