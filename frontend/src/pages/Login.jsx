import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PasswordField from "../components/Auth/PasswordField";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";

export default function Login() {
  return (
    <AuthCard>
      <AuthHeader
        title="Login"
        subtitle="Sign in to your account to continue"
      />

      <InputField placeholder="Enter your Username" />

      <div style={{ textAlign: "right", color: "#e0edf7", fontSize: "14px", marginBottom: "10px" }}>
        Forgot Password ?
      </div>

      <PasswordField placeholder="Enter your Password" />

      <PrimaryButton text="Sign in" />

      <AuthLink text="Don't have an account?" linkText="Sign up" />
    </AuthCard>
  );
}