import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { storeOtp, getOtpData } from "../../src/utils/otpStore.js";
import { sendOtpToEmail } from "../services/emailService.js"; 
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js"; 

// 1️⃣ Initiate Signup (Send OTP to email)
export const initiateUserSignup = async (req, res) => {
  const { fullName, mobile, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const hashedPassword = await bcrypt.hash(password, 10);

    await storeOtp(email, {
      fullName,
      mobile,
      email,
      password: hashedPassword,
      otp,
    });

    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ OTP Send Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2️⃣ Verify OTP & Register User
export const verifyUserSignup = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const data = await getOtpData(email, otp);

    if (!data) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const newUser = await User.create({
      fullName: data.fullName,
      mobile: data.mobile,
      email: data.email,
      password: data.password, // already hashed
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err.message);
    res.status(500).json({ message: "Registration failed" });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. Generate tokens
    const payload = { userId: user._id, email: user.email, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    console.log(`${user.fullName} Loggedin`)

    // 4. Respond with tokens
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      authorizedCourses : user.authorizedCourses,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("❌ Refresh Token Error:", err.message);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// 1️⃣ Initiate Forgot Password (Send OTP)
export const initiateForgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await storeOtp(email, { otp }); // just store OTP for reset

    await sendOtpToEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email for password reset" });
  } catch (err) {
    console.error("❌ Forgot Password - OTP Send Error:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// 2️⃣ Verify OTP and Reset Password
export const verifyForgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const data = await getOtpData(email, otp);
    if (!data) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ email }, { $set: { password: hashedPassword } });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Forgot Password - Reset Error:", err.message);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
