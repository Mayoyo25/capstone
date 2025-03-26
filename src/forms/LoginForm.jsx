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
  loading, // Add loading prop
}) {
  return (
    <AuthContainer>
      <div className="login-card">
        {/* Role Error */}
        {roleError && <div className="bg-[#720f0f] text-white text-lg mt-2.5 text-center rounded-xl p-1">{roleError}</div>}

        {/* General Error */}
        {error && <div className="error-message">{error}</div>}

        <div className="logo">CPMP</div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              disabled={loading} // Disable input during loading
            />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={loading} // Disable input during loading
            />
          </div>

          {/* Options Row */}
          <div className="options-row">
            {/* Remember Me Checkbox */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                disabled={loading} // Disable checkbox during loading
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>

            {/* Forgot Password Button */}
            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/forgot-password")}
              disabled={loading} // Disable button during loading
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="sign-in-button"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Signing In..." : "Sign In"} {/* Show loading text */}
          </button>

          {/* Sign Up Button */}
          <button
            type="button"
            className="sign-up-button"
            onClick={() => navigate("/register")}
            disabled={loading} // Disable button during loading
          >
            Sign Up
          </button>
        </form>
      </div>
    </AuthContainer>
  );
}

export default LoginForm;