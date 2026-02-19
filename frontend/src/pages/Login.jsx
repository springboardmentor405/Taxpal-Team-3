import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import InputField from '../components/Auth/InputField';
import AuthLayout from '../layouts/AuthLayout';
import '../sass/Login.scss';
import logo from '../assets/images/logo.svg'
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';

// function Login() {
//   return (
//     <AuthLayout>

//       <AuthCard>
//         <AuthHeader
//           title={"Login"}
//           subtitle={'Sign in to your account to continue'}
//         />
//         <InputField
//           placeholder={'Enter your Username'}
//         />
//         <PasswordField
//           placeholder={'Enter your Password'}
//         />
//         <PrimaryButton
//           text={'Sign in'}
//         />
//         <AuthLink
//           text={"Don't have an account ?"} linkText={'Sign up'}
//         />
//       </AuthCard>
//     </AuthLayout>
//   );
// }

// export default Login;


import { useState } from "react";
import axios from "axios";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );

      console.log(res.data);
      alert("Login Success ✅");

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Login"
          subtitle="Sign in to your account to continue"
        />

        <InputField
          placeholder="Enter your Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <PasswordField
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <PrimaryButton
          text="Sign in"
          onClick={handleLogin}
        />

        <AuthLink
          text="Don't have an account?"
          linkText="Sign up"
        />
      </AuthCard>
    </AuthLayout>
  );
}
