import { useState } from "react";
import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import AuthLayout from "../layouts/AuthLayout";
import OtpInput from "../components/Auth/OTPInput";  
import "../sass/verifyemail.scss"

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading] = useState(false);

  const handleVerify = () => {
    if (otp.length !== 6) {
      return alert("Please enter complete OTP");
    }

    console.log("Entered OTP:", otp);
  };

  return (
    <AuthLayout>
  <AuthCard>
    <div className="verify-box">

      <AuthHeader
        title="Verify your email address"
        subtitle="A verification code has been sent to abc@gmail.com"
      />

      <OtpInput
        length={6}
        value={otp}
        onChange={setOtp}
      />

      <PrimaryButton
        text={loading ? "Verifying..." : "Verify Email"}
        onClick={handleVerify}
        disabled={loading}
      />

      <div className="verify-links">
        <span>Resend code</span>
        <span>Change email</span>
      </div>

      <AuthLink
        text="Remember your password?"
        linkText="Log in"
        to="/login"
      />

    </div>
  </AuthCard>
</AuthLayout>
  );
}

export default VerifyEmail;