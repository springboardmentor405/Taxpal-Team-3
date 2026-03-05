import AuthCard from '../components/Auth/AuthCard';
import AuthHeader from '../components/Auth/AuthHeader';
import AuthLayout from '../layouts/AuthLayout';
import PasswordField from '../components/Auth/PasswordField';
import PrimaryButton from '../components/Auth/PrimaryButton';
import AuthLink from '../components/Auth/AuthLink';
import { Lock, Eye } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = () => {
    if (!newPassword || !confirmPassword) {
      return alert("Please fill in all fields ❌");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match ❌");
    }
    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters ❌");
    }
    alert("Password Reset Successful ✅");
    navigate("/login");
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthHeader
          title="Reset Password"
          subtitle="Create a new password for your account"
        />
        <PasswordField
          placeholder="Enter a new password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordField
          placeholder="Confirm new Password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <PrimaryButton
          text="Reset Password"
          onClick={handleReset}
        />
        <AuthLink
          text="Back to"
          linkText="Sign In"
          to="/login"
        />
      </AuthCard>
    </AuthLayout>
  );
}

export default ResetPassword;