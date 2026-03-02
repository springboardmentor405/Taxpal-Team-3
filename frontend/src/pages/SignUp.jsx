import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import InputField from '../components/Auth/InputField';
import AuthLayout from '../layouts/AuthLayout';
import '../sass/SignUp.scss';
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";

function SignUp() {

  const API_URL = "http://localhost:5000/api/auth";
  const navigate = useNavigate();

  // SignUp.jsx
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API_URL}/register`, formData);
    toast.success(res.data.message || 'Registration successful');
    navigate('/login');
  } catch (err) {
    toast.error(err.response?.data?.message || "Error occurred");
  }
};

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Get Started"
          subtitle="Create your free account"
        />


        
<form onSubmit={handleSubmit}>

  <InputField
    placeholder="Enter your Name"
    leftIcon={<User size={20} />}
    name="name"
    value={formData.name}
    onChange={handleChange}
  />

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

  <PasswordField
    placeholder="Confirm Password"
    leftIcon={<Lock size={20} />}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
  />

  <PrimaryButton text="Sign Up" type="submit" />

</form>
        <AuthLink
          text="Already have an account?"
          linkText="Log in"
          href="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default SignUp;