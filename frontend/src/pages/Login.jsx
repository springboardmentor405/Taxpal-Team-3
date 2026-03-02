import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import InputField from '../components/Auth/InputField';
import AuthLayout from '../layouts/AuthLayout';
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';
import { Mail, Lock } from 'lucide-react';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });


  const API_URL = "http://localhost:5000/api/auth";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_URL}/login`, formData);

    // Save token in localStorage
    localStorage.setItem("token", res.data.token);

    toast.success(res.data.message || 'Logged in');

    // Redirect to dashboard
    navigate("/dashboard");
  } catch (err) {
    toast.error(err.response?.data?.message || "Login failed");
  }
};

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Login"
          subtitle="Sign in with your Email"
        />
        <form onSubmit={handleLogin}>
          <InputField
            placeholder="Enter your Email"
            leftIcon={<Mail size={20} />}
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <PasswordField
            placeholder="Enter your Password"
            leftIcon={<Lock size={20} />}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <PrimaryButton text="Sign In" type="submit" />
        </form>

        <AuthLink
          text="Don't have an account?"
          linkText="Sign up"
          href="/signup"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default Login;