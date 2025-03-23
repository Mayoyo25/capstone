import '../styles/AuthContainer.css';
function AuthContainer({children}) {
  
  return (
    <div className="auth-container">
    {children}
    </div>
  );
}

export default AuthContainer;