import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetOtp: { type: String, default: null }, 
  otpExpires: { type: Date, default: null }  
});

export default mongoose.model('User', UserSchema);