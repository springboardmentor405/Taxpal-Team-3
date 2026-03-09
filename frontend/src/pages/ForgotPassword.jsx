import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";

import { Mail } from "lucide-react";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const apiBase =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiBase}/api/auth/forgot-password`, {
        email,
      });

      toast.success("Verification email sent! Please check your inbox.");
      console.log(response.data);
      
      localStorage.setItem('resetEmail', email);
      
      navigate("/verify-mail");
      
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Forgot Password"
          subtitle="Enter your email address to reset your password"
        />

        <div style={{ marginBottom: "1rem" }}>
          <InputField
            placeholder="Enter your email address"
            leftIcon={<Mail size={20} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <PrimaryButton
          text={loading ? "Verifying..." : "Verify email"}
          onClick={handleVerifyEmail}
          disabled={loading}
        />

        <AuthLink
          text="Remember your password?"
          linkText="Log in"
          to="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default ForgotPassword;