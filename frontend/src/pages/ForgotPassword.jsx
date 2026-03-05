import { useState } from "react";
import axios from "axios";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";

import { Mail } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async () => {
    // Basic validation
    if (!email) {
      return alert("Please enter your email address");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return alert("Enter a valid email address");
    }

    try {
      setLoading(true);

      const apiBase =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Updated endpoint for password reset
      const response = await axios.post(`${apiBase}/api/auth/forgot-password`, {
        email,
      });

      alert("Verification email sent! Please check your inbox.");
      console.log(response.data);
      
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      alert(message);
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