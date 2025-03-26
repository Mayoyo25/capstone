import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css';
import AuthContainer from './AuthFormContainer';
import authService from '../services/authService';
import AuthPageWrapper from './AuthPageWrapper';
import SuccessMessage from './SuccessMessage'
import ForgotPasswordForm from '../forms/ForgotPasswordForm'

function ForgotPassword() {
  const navigate = useNavigate();

  // Local state management
  const [formState, setFormState] = useState({
    email: '',
    isSubmitted: false,
    loading: false,
    error: '',
  });

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // Reset form state
  const resetState = () => {
    setFormState({
      email: '',
      isSubmitted: false,
      loading: false,
      error: '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update state to show loading and clear previous errors
      setFormState(prev => ({
        ...prev,
        loading: true,
        error: '',
        isSubmitted: false
      }));

      // Make API call to request password reset
      await authService.forgotPassword(formState.email);

      // Show success message
      setFormState(prev => ({
        ...prev,
        isSubmitted: true,
        loading: false
      }));
    } catch (error) {
      console.error('Password reset error:', error);

      // Comprehensive error handling
      const errorMessage = extractErrorMessage(error);

      setFormState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false
      }));
    }
  };

  // Extract meaningful error message
  const extractErrorMessage = (error) => {
    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        return error.response.data.detail;
      } else if (error.response.data.email) {
        return error.response.data.email.join(' ');
      }
      return 'Error sending reset link. Please try again.';
    }
    return 'Network error. Please check your connection and try again.';
  };

  // Handle navigation back to login
  const handleBackToLogin = () => {
    resetState();
    navigate('/login');
  };

  return (
    <AuthPageWrapper>
      <AuthContainer>
        <div className="forgot-password-card">
          <div className="logo">CPMP</div>
          <h2>Forgot Password</h2>

          {!formState.isSubmitted ? (
            <ForgotPasswordForm
              email={formState.email}
              loading={formState.loading}
              error={formState.error}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onBackToLogin={handleBackToLogin}
            />
          ) : (
            <SuccessMessage onBackToLogin={handleBackToLogin} />
          )}
        </div>
      </AuthContainer>
    </AuthPageWrapper>
  );
}

export default ForgotPassword;