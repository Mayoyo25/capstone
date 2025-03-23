import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validate passwords match
      if (password !== confirmPassword) {
        setError("Passwords don't match!");
        return;
      }
      
      // Get token and uid from URL query params
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const uid = params.get('uid');
      
      if (!token || !uid) {
        setError('Invalid password reset link');
        return;
      }
      
      // Submit password reset request
      await authService.resetPassword(uid, token, password, confirmPassword);
      
      // Show success message and redirect to login
      setResetSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (error.response && error.response.data) {
        if (error.response.data.detail) {
          setError(error.response.data.detail);
        } else if (error.response.data.password) {
          setError(error.response.data.password.join(' '));
        } else {
          // Combine all error messages
          const errorMsg = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${value.join(' ')}`)
            .join('\n');
            
          setError(errorMsg || 'Failed to reset password');
        }
      } else {
        setError('Network error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="mt-2 text-gray-600">
            Please enter your new password below
          </p>
        </div>

        {resetSuccess ? (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            <p>Password reset successful! Redirecting to login page...</p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="New password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>

            <div className="text-center text-sm">
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;