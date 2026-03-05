import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import AuthLink from "../components/Auth/AuthLink";
import PrimaryButton from "../components/Auth/PrimaryButton";
import { Mail } from "lucide-react";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!email) {
      return alert("Please enter your email address ❌");
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Reset link sent! Please check your email ✅");
        navigate("/login");
      } else {
        alert(data.message || "Something went wrong ❌");
      }
    } catch (error) {
      alert("Server error. Please try again.");
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
        <p className="fp-label">Email address</p>
        <div className="fp-input-wrapper">
          <span className="fp-icon">
            <Mail size={20} />
          </span>
          <span className="fp-divider"></span>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="fp-input-text"
          />
        </div>
        <PrimaryButton
          text={loading ? "Sending..." : "Verify email"}
          onClick={handleVerify}
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