import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordAPI } from "../config/api";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import AuthLayout from "../layouts/AuthLayout";
import PasswordField from "../components/Auth/PasswordField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import { Lock, Eye } from "lucide-react";

function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp]     = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    const storedOtp   = localStorage.getItem("verifiedOtp");
    if (storedEmail) setEmail(storedEmail);
    if (storedOtp)   setOtp(storedOtp);
    if (!storedEmail || !storedOtp) {
      toast.error("Session expired. Please start over.");
      navigate("/forgot-password");
    }
  }, [navigate]);

  const handleReset = async () => {
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords do not match"); return; }
    try {
      setLoading(true);
      await resetPasswordAPI(email, otp, newPassword);
      toast.success("Password reset successful!");
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("verifiedOtp");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader title="Reset Password" subtitle="Create a new password for your account" />
        <PasswordField
          placeholder="Enter a new password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordField
          placeholder="Confirm new password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <PrimaryButton text={loading ? "Resetting..." : "Reset Password"} onClick={handleReset} disabled={loading} />
        <AuthLink text="Back to" linkText="Sign In" to="/login" />
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;
