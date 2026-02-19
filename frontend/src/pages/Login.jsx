import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import InputField from '../components/Auth/InputField';
import AuthLayout from '../layouts/AuthLayout';
import '../sass/Login.scss';
import logo from '../assets/images/logo.svg'
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';

function Login() {
  return (
    <AuthLayout>
      {/* <div className="login-box">
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
      </div> */}
      <AuthCard>
        <AuthHeader title={"Login"} subtitle={'Sign in to your account to continue'}/>
        <InputField  placeholder={'Enter your Username'} />
        <PasswordField placeholder={'Enter your Password'} />
        <PrimaryButton text={'Sign in'} />
        <AuthLink text={"Don't have an account ?"} linkText={'Sign up'}/>
    
      
      </AuthCard>
  
      
    </AuthLayout>
  );
}

export default Login;
