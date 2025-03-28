import React from "react";
import AuthContainer from "../components/AuthFormContainer";

function LoginForm({
  roleError,
  handleSubmit,
  email = "",
  setEmail,
  password = "",
  setPassword,
  rememberMe = false,
  setRememberMe,
  navigate,
  error,
  loading,
}) {
  return (
    <AuthContainer>
      <div className="login-card">
        {roleError && <div className="bg-[#720f0f] text-white text-lg mt-2.5 text-center rounded-xl p-1">{roleError}</div>}

        {error && <div className="text-red-500 bg-[#ffeeee] border-[1px] border-red-500 p-2.5 mb-4 rounded-sm">{error}</div>}

        <div className="logo">CPMP</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="text-gray-900"
              required
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="text-gray-900"
              required
              disabled={loading}
            />
          </div>

          <div className="options-row">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="text-gray-900"
                disabled={loading}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/forgot-password")}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="sign-in-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            className="sign-up-button"
            onClick={() => navigate("/register")}
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