import PasswordInput from '../components/PasswordInput'
function ResetPasswordForm({ formState, onInputChange, onSubmit }) {
  const { password, confirmPassword, loading, error } = formState;

  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <PasswordInput
          id="password"
          label="New Password"
          value={password}
          onChange={(e) => onInputChange('password', e.target.value)}
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
        />
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
        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
          Back to login
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm