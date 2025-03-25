import React from 'react';
import useAuthStore from '../stores/authStore';
import '../styles/ForgotPassword.css';
import AuthContainer from './AuthFormContainer';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate()
  const {
    email,
    isSubmitted,
    loading,
    error,
    setEmail,
    setIsSubmitted,
    setLoading,
    setError,
    resetState,
  } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setIsSubmitted(false);

      // Make API call to request password reset
      await authService.forgotPassword(email);

      // Show success message
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset error:', error);

      // Handle errors
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          setError(error.response.data.detail);
        } else if (error.response.data.email) {
          setError(error.response.data.email.join(' '));
        } else {
          setError('Error sending reset link. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageWrapper>
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

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className={`reset-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button
              type="button"
              className="back-to-login-button"
              onClick={() => {
                resetState();
                navigate('/login')
              }}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <div className="success-message">
            <p>Password reset link has been sent to your email address.</p>
            <button
              className="back-to-login-button"
              onClick={() => {
                resetState();
                navigate('/login')
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </AuthContainer>
  </AuthPageWrapper>
  );
}

export default ForgotPassword;