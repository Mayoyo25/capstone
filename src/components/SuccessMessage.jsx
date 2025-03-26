function SuccessMessage({ onBackToLogin }) {
  return (
    <div className="success-message">
      <p>Password reset link has been sent to your email address.</p>
      <button
        className="back-to-login-button"
        onClick={onBackToLogin}
      >
        Back to Login
      </button>
    </div>
  );
}
export default SuccessMessage