import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PasswordField from "../components/Auth/PasswordField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";

import { User, Mail, Lock, Eye } from "lucide-react";

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    
    if (!username || !email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
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

      toast.success("Signup successful! Please log in.");
      console.log(response.data);

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      navigate("/login");

    } catch (error) {
      const message =
        error.response?.data?.message || "Signup failed";
      toast.error(message);
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