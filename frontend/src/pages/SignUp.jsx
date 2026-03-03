import { useState } from "react";
import axios from "axios";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PasswordField from "../components/Auth/PasswordField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";

import { User, Mail, Lock, Eye } from "lucide-react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    
    if (!username || !email || !password || !confirmPassword) {
      return alert("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return alert("Enter a valid email address");
    }

    if (password.length < 8) {
      return alert("Password must be at least 8 characters");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      setLoading(true);

      const apiBase =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await axios.post(`${apiBase}/api/auth/signup`, {
        name: username,
        email,
        password,
      });

      alert("Signup successful");
      console.log(response.data);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed";
      alert(message);
    } finally {
      setLoading(false);
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
          value={username}
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
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <PrimaryButton
          text={loading ? "Signing up..." : "Sign Up"}
          onClick={handleSignUp}
          disabled={loading}
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