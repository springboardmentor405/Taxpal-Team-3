import AuthLayout from '../layouts/AuthLayout';
import '../sass/Login.scss';

function Login() {
  return (
    <AuthLayout>
      <div className="login-box">
        <h2>Login</h2>
        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default Login;
