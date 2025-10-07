import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  confirmPassword: string;
  otp?: number; // 🔹 for storing hashed OTP
  otpExpires?: Date; // 🔹 OTP expiry time
  isVerified?: boolean;
  // Multi-Step Signup fields
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  mobile?: string;
  isMobileVerified?: boolean;
  profilePic?: string; // cloudinary URL:
  resume?: string; // Cloudinary URL;
}

const userSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
    },
    otp: {
      type: Number,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Multiple-step fields
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    mobile: {
      type: String,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
    zipCode: {
      type: String,
    },
    resume: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>('User', userSchema);
