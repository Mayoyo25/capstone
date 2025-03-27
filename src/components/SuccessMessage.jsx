function SuccessMessage({ onBackToLogin }) {
  return (
    <div className="text-center pt-5">
      <p className="text-[#4ecdc4] mb-5">Password reset link has been sent to your email address.</p>
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