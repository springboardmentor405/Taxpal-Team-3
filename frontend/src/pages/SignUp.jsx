import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import InputField from '../components/Auth/InputField';
import AuthLayout from '../layouts/AuthLayout';
import '../sass/SignUp.scss';
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';
import { User, Mail, Lock, Eye } from "lucide-react";
import { useState } from "react";
import axios from "axios";
function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

  const handleSignUp = async () => {
    // 1. Basic Validation before sending to backend
    if (password !== confirmPassword) {
      return alert("Passwords do not match! ❌");
    }

    try {
      // 2. Updated URL to match your backend route (/api/signup)
      // We send 'username', 'email', and 'password' as defined in your User model
      const res = await axios.post(
        "http://localhost:5000/api/signup", 
        { 
          username: username, 
          email: email, 
          password: password 
        }
      );

      console.log(res.data);
      alert("SignUp Success ✅");
      
      // 3. Optional: Redirect to login page after success
      // navigate("/login"); 

    } catch (error) {
      // Improved error handling to show backend error messages
      const errorMsg = error.response?.data?.error || "SignUp Failed ❌";
      alert(errorMsg);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Get Started"
          subtitle="Create your free account"
        />

        <InputField
          placeholder="Enter your Username"
          leftIcon={<User size={20} />}
          value={username} // Added value for controlled component
          onChange={(e) => setUsername(e.target.value)}
        />

        <InputField
          placeholder="Enter your Email"
          leftIcon={<Mail size={20} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          placeholder="Enter your Password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <PasswordField
          placeholder="Confirm your Password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={confirmPassword}
          onChange={(e) => setconfirmPassword(e.target.value)}
        />

        <PrimaryButton
          text="Sign Up"
          onClick={handleSignUp} // Renamed to handleSignUp for clarity
        />

        <AuthLink
          text="Already have an account?"
          linkText="Log in"
          to="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default SignUp;