import AuthContainer from "./AuthFormContainer";

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
  error 
}){
 return (
  <AuthContainer>
          <div className="login-card">
            {roleError && <div className="role-error-temporary">{roleError}</div>}
            <div className="logo">CPMP</div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="options-row">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe">Remember Me</label>
                </div>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => navigate('/forgot-password')}
                >
                  Forgot Password?
                </button>
              </div>
              <button type="submit" className="sign-in-button">
                Sign In
              </button>
              <button
                type="button"
                className="sign-up-button"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </button>
            </form>
          </div>
        </AuthContainer>
 )
}
export default LoginForm