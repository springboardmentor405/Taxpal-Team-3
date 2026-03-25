

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  phone: { type: String, default: "" },
  role: { type: String, default: "" },
  location: { type: String, default: "" },
  notificationSettings: {
    taxReminder: { type: Boolean, default: true },
    budgetAlert: { type: Boolean, default: true },
    newTransaction: { type: Boolean, default: false },
    lowBalance: { type: Boolean, default: true },
    taxFreq: { type: String, default: "3 days before" },
    budgetFreq: { type: String, default: "At 80%" }
  },
  resetOtp: { type: String, default: null }, 
  otpExpires: { type: Date, default: null }  
});

export default mongoose.model('User', UserSchema);