import React from 'react';
import AuthContainer from '../components/AuthFormContainer';
import { Loader } from 'lucide-react';

function LoginForm({
  roleError,
  handleSubmit,
  email = '',
  setEmail,
  password = '',
  setPassword,
  rememberMe = false,
  setRememberMe,
  navigate,
  error,
  loading,
}) {
  return (
    <AuthContainer>
      <div className='login-card'>
        {roleError && (
          <div className='bg-[#720f0f] text-white text-lg mt-2.5 text-center rounded-xl p-1'>
            {roleError}
          </div>
        )}

        {error && (
          <div className='text-red-500 bg-[#ffeeee] border-[1px] border-red-500 p-2.5 mb-4 rounded-sm'>
            {error}
          </div>
        )}

        <div className='logo'>CPMP</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Email Address'
              className={`text-gray-900 ${loading ? 'opacity-70' : ''}`}
              required
              disabled={loading}
            />
          </div>
          <div className='input-group'>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className={`text-gray-900 ${loading ? 'opacity-70' : ''}`}
              required
              disabled={loading}
            />
          </div>

          <div className='options-row'>
            <div className='remember-me'>
              <input
                type='checkbox'
                id='rememberMe'
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className={`text-gray-900 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
                disabled={loading}
              />
              <label
                htmlFor='rememberMe'
                className={loading ? 'opacity-70' : ''}
              >
                Remember Me
              </label>
            </div>
            <button
              type='button'
              className={`text-button ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={() => !loading && navigate('/forgot-password')}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type='submit'
            className={`sign-in-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className='flex items-center justify-center'>
                <Loader className='animate-spin mr-2 h-4 w-4' />
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          <button
            type='button'
            className={`sign-up-button ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            onClick={() => !loading && navigate('/register')}
            disabled={loading}
          >
            Sign Up
          </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default LoginForm;
