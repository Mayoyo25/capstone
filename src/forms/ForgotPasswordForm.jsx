function ForgotPasswordForm({
  email,
  loading,
  error,
  onInputChange,
  onSubmit,
  onBackToLogin
}) {
  return (
    <form onSubmit={onSubmit}>
      <p>Enter your email address to receive password reset instructions</p>

      <div className="input-group">
        <input
          type="email"
          value={email}
          onChange={(e) => onInputChange('email', e.target.value)}
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
        onClick={onBackToLogin}
        disabled={loading}
      >
        Back to Login
      </button>
    </form>
  );
}
export default ForgotPasswordForm