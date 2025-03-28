import React from 'react';
import AuthContainer from '../components/AuthFormContainer';
import UserTypeMenu from '../components/UserTypeMenu';
import { VALID_USER_TYPES } from '../utils/userTypeUtils';
import { ChevronUp ,ChevronDown} from 'lucide-react';

function RegisterForm({
  formState,
  uiState,
  updateFormField,
  updateUiState,
  handleSubmit,
  handleUserTypeSelect,
  navigate,
}) {
  const {
    fullName,
    email,
    password,
    confirmPassword,
    selectedUserType,
  } = formState;

  const {
    isUserMenuOpen,
    loading,
    error,
    roleError,
  } = uiState;

  return (
    <AuthContainer>
      <div className="register-card">
        <div className="logo">CPMP</div>
        <h2>Register</h2>

        {error && <div className="text-red-500 bg-[#ffeeee] border-[1px] border-red-500 p-2.5 mb-4 rounded-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={fullName}
              onChange={(e) => updateFormField('fullName', e.target.value)}
              placeholder="Full Name"
              className='text-gray-900'
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => updateFormField('email', e.target.value)}
              placeholder="Email Address"
              className='text-gray-900'
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => updateFormField('password', e.target.value)}
              placeholder="Password"
              className='text-gray-900'
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => updateFormField('confirmPassword', e.target.value)}
              placeholder="Confirm Password"
              className='text-gray-900'
              required
            />
          </div>

          <div className={`user-type-container ${roleError ? 'error' : ''}`}>
            <button
              type="button"
              className={`user-type-button ${roleError ? 'error' : ''}`}
              onClick={() => updateUiState('isUserMenuOpen', !isUserMenuOpen)}
            >
              {selectedUserType}
              {isUserMenuOpen ? <ChevronUp /> : <ChevronDown />}
            </button>

            {roleError && <div className="role-error">{roleError}</div>}

            {isUserMenuOpen && (
              <UserTypeMenu
                onSelect={handleUserTypeSelect}
                closeMenu={() => updateUiState('isUserMenuOpen', false)}
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
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default RegisterForm;