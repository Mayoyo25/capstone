import React from 'react';
import AuthContainer from '../components/AuthFormContainer';
import { ChevronUp, ChevronDown, Loader } from 'lucide-react';
import { VALID_USER_TYPES } from '../utils/userTypeUtils';

function RegisterForm({
  formData,
  updateFormField,
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
    loading,
    error,
    roleError,
    emailError,
  } = formData;

  return (
    <AuthContainer>
      <div className='register-card'>
        <div className='logo'>CPMP</div>
        <h2>Register</h2>

        {error && (
          <div className='text-red-500 bg-[#ffeeee] border-[1px] border-red-500 p-2.5 mb-4 rounded-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <input
              type='text'
              value={fullName}
              onChange={(e) => updateFormField('fullName', e.target.value)}
              placeholder='Full Name'
              className='text-gray-900'
              required
              disabled={loading}
            />
          </div>
          <div className='input-group'>
            <input
              type='email'
              value={email}
              onChange={(e) => updateFormField('email', e.target.value)}
              placeholder='Email Address'
              className='text-gray-900'
              required
              disabled={loading}
            />
            {emailError && (
              <div className='text-red-500 text-sm mt-1'>{emailError}</div>
            )}
          </div>
          <div className='input-group'>
            <input
              type='password'
              value={password}
              onChange={(e) => updateFormField('password', e.target.value)}
              placeholder='Password'
              className='text-gray-900'
              required
              disabled={loading}
            />
          </div>
          <div className='input-group'>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) =>
                updateFormField('confirmPassword', e.target.value)
              }
              placeholder='Confirm Password'
              className='text-gray-900'
              required
              disabled={loading}
            />
          </div>
          <div className='dropdown-container w-full'>
            <details
              className='dropdown w-full mb-3'
              id='user-type-dropdown'
              disabled={loading}
            >
              <summary
                className={`btn btn-outline w-full ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {selectedUserType}
                {document
                  .getElementById('user-type-dropdown')
                  ?.hasAttribute('open') ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </summary>
              <ul className='menu dropdown-content bg-base-100 rounded-box z-1 w-80 p-2 shadow-sm'>
                {VALID_USER_TYPES.map((type) => (
                  <li
                    key={type}
                    onClick={() => !loading && handleUserTypeSelect(type)}
                    className={loading ? 'opacity-70 cursor-not-allowed' : ''}
                  >
                    <a>{type}</a>
                  </li>
                ))}
              </ul>
            </details>
            {roleError && (
              <div className='text-red-500 text-sm mt-1 mb-2'>{roleError}</div>
            )}
          </div>

          <button
            type='submit'
            className={`register-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className='flex items-center justify-center'>
                <Loader className='animate-spin mr-2 h-4 w-4' />
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
          <button
            type='button'
            className={`back-to-login-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && navigate('/login')}
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
