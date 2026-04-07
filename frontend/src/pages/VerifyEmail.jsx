import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyOtpAPI } from "../config/api";

import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";
import OtpInput from "../components/Auth/OTPInput";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp]       = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail]   = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("resetEmail");
    if (stored) { setEmail(stored); }
    else { toast.warn("Email session expired. Please try again."); navigate("/forgot-password"); }
  }, [navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) { toast.error("Please enter the complete 6-digit OTP"); return; }
    try {
      setLoading(true);
      await verifyOtpAPI(email, otp);
      localStorage.setItem("verifiedOtp", otp);
      toast.success("OTP verified successfully!");
      navigate("/reset-password");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <div className="verify-box">
          <AuthHeader
            title="Verify your email address"
            subtitle={`A verification code has been sent to ${email || "your email"}`}
          />
          <div style={{ margin: "20px 0" }}>
            <OtpInput length={6} value={otp} onChange={setOtp} />
          </div>
          <PrimaryButton text={loading ? "Verifying..." : "Verify Email"} onClick={handleVerify} disabled={loading} />
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <AuthLink text="Back to"             linkText="Log in" to="/login" />
            <br />
            <AuthLink text="Didn't receive code?" linkText="Resend" to="/forgot-password" />
          </div>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
