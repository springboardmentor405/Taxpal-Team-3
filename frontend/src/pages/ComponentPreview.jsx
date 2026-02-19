import { useState } from "react";
import AuthCard from "../components/Auth/AuthCard";
import AuthHeader from "../components/Auth/AuthHeader";
import InputField from "../components/Auth/InputField";
import PasswordField from "../components/Auth/PasswordField";
import OTPInput from "../components/Auth/OTPInput";
import PrimaryButton from "../components/Auth/PrimaryButton";
import AuthLink from "../components/Auth/AuthLink";
import { User, Mail, Lock, Eye } from "lucide-react";


export default function ComponentPreview() {
  const [form, setForm] = useState({});

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  return (
    <div style={{  width: "420px",padding: "40px" }}>
      <AuthCard>
        <AuthHeader
          title="Component Preview"
          subtitle="Updated Inputs with Labels"
        />
        

        <InputField
          placeholder="Username" leftIcon={<User size={20} />}
          label="Username"
          onChange={handleChange("username")}
        />

        <InputField
          label="Email"
          type="email"
          placeholder="Email" leftIcon={<Mail size={20} />}
          onChange={handleChange("email")}
        />

        <PasswordField
          label="Password"
          placeholder="Password"
          type="password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
          onChange={handleChange("password")}
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Confirm Password"
          type="password"
          leftIcon={<Lock size={20} />}
          rightIcon={<Eye size={20} />}
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