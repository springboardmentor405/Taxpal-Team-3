import { useState } from "react";
import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PasswordField from "../components/Auth/PasswordField";
import OTPInput from "../components/Auth/OTPInput";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";

export default function ComponentPreview() {
  const [form, setForm] = useState({});

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{ padding: "40px" }}>
      <AuthCard>
        <AuthHeader
          title="Component Preview"
          subtitle="Updated Inputs with Labels"
        />

        <InputField
          label="Username"
          placeholder="Enter your username"
          onChange={handleChange("username")}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          onChange={handleChange("email")}
        />

        <PasswordField
          label="Password"
          placeholder="Enter your password"
          onChange={handleChange("password")}
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Confirm your password"
          onChange={handleChange("confirmPassword")}
        />

        <OTPInput length={6} />

        <PrimaryButton text="Primary Button" />

        <AuthLink
          text="Already have an account?"
          linkText="Login"
        />
      </AuthCard>
    </div>
  );
}