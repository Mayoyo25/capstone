import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/ResetPassword.css'
import AuthPageWrapper from '../components/AuthPageWrapper'

function ResetPassword() {
  const navigate = useNavigate();

  // Local state management
  const [formState, setFormState] = useState({
    password: '',
    confirmPassword: '',
    loading: false,
    error: '',
    resetSuccess: false,
  });

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Extract URL parameters
  const getResetParams = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const uid = params.get('uid');
    return { token, uid };
  };

  // Handle password reset submission
  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!validateInputs()) return;

    try {
      // Update state for loading
      setFormState((prev) => ({
        ...prev,
        loading: true,
        error: '',
        resetSuccess: false,
      }));

      // Get reset parameters
      const { token, uid } = getResetParams();

      if (!token || !uid) {
        throw new Error('Invalid password reset link');
      }

      // Submit password reset request
      await authService.resetPassword(
        uid,
        token,
        formState.password,
        formState.confirmPassword
      );

      // Handle successful reset
      handleSuccessfulReset();
    } catch (error) {
      handleResetError(error);
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  };

  // Validate input fields
  const validateInputs = () => {
    if (formState.password !== formState.confirmPassword) {
      setFormState((prev) => ({
        ...prev,
        error: "Passwords don't match!",
      }));
      return false;
    }
    return true;
  };

  // Handle successful password reset
  const handleSuccessfulReset = () => {
    setFormState((prev) => ({ ...prev, resetSuccess: true }));

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  // Handle reset error
  const handleResetError = (error) => {
    let errorMessage = 'Network error. Please try again later.';

    if (error.response && error.response.data) {
      if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.password) {
        errorMessage = error.response.data.password.join(' ');
      } else {
        // Combine all error messages
        errorMessage =
          Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value.join(' ')}`)
            .join('\n') || 'Failed to reset password';
      }
    }

    setFormState((prev) => ({ ...prev, error: errorMessage }));
  };

  return (
   <AuthPageWrapper>
     <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <h1>Reset Your Password</h1>
          <p>Please enter your new password below</p>
        </div>

        {formState.resetSuccess ? (
          <div className="p-4 bg-[#d4edda] text-[#155724] border-[1px] border-[#c3e6cb] rounded-sm text-center">
            <p>Password reset successful! Redirecting to login page...</p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="reset-password-form">
            {formState.error && (
              <div className="text-red-500 bg-[#ffeeee] border-[1px] border-red-500 p-2.5 mb-4 rounded-sm">{formState.error}</div>
            )}

            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <input
                type="password"
                id="password"
                value={formState.password}
                className='text-gray-900'
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formState.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                className='text-gray-900'
                required
              />
            </div>

            <button type="submit" disabled={formState.loading}>
              {formState.loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
   </AuthPageWrapper>
  );
}

export default ResetPassword;