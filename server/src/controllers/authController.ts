import express from 'express';
import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate numeric OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 mins

    // ✅ Create user with OTP
    const newUser = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });
    await newUser.save();

    // ✅ Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS, // App password (not normal password)
      },
      tls: {
        rejectUnauthorized: false, // ✅ Ignore SSL validation only in local/dev
      },
    });

    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email',
      text: `Your verification OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.status(201).json({
      message:
        'User registered successfully. OTP sent to email for verification.',
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified)
      return res
        .status(400)
        .json({ message: 'Please verify your email before logging in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.isVerified)
      return res.status(400).json({ message: 'User already verified' });

    if (!user.otp || !user.otpExpires)
      return res
        .status(400)
        .json({ message: 'No OTP found. Please register again.' });

    if (Date.now() > user.otpExpires.getTime())
      return res.status(400).json({ message: 'OTP expired' });

    if (user.otp !== Number(otp))
      return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: 'Email already verified. No need to resend OTP.' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"MyApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'New OTP for Email Verification',
      text: `Your new OTP is ${otp}. It will expire in 5 minutes.`,
    });
    res.status(200).json({ message: 'New OTP sent to your email.' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const saveName = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName } = req.body;

    // Find user by email and update their name
    const user = await User.findOneAndUpdate(
      { email }, // find condition
      { firstName, lastName }, // update fields
      { new: true }, // return updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Name saved successfully', user });
  } catch (error) {
    console.error('Error in Name saving:', error);
    res.status(500).json({ message: 'Internal server Error' });
  }
};

export const saveZip = async (req: Request, res: Response) => {
  try {
    const { email, zipCode } = req.body;
    const user = await User.findOneAndUpdate(
      { email }, // find condition
      { zipCode }, // update fields
      { new: true }, // return updated document
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Zip Code saved successfully', user });
  } catch (error) {
    console.error('Error in Name saving:', error);
    res.status(500).json({ message: 'Internal server Error' });
  }
};

// Only work for the development and testing if anyone want to real time otp send to mobile then add the service like Twilio (most popular) Vonage (Nexmo) MSG91 (India-focused) AWS SNS
export const saveMobile = async (req: Request, res: Response) => {
  try {
    const { email, mobile } = req.body;
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 minutes

    // Save to user
    const user = await User.findOneAndUpdate(
      email,
      { mobile, otp, otpExpires },
      { new: true },
    );

    // ✅ Development-only: log OTP to console
    console.log(`[DEV OTP] User with Mobile: ${mobile}, OTP: ${otp}`);
    // Send response (no real SMS)
    res.json({ message: 'OTP generated (check console)', user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtpDev = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpires! < new Date())
      return res.status(400).json({ message: 'OTP expired' });
    // ✅ Mark mobile as verified as verified
    user.isMobileVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Mobile verified', user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
