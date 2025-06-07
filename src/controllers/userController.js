import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { storeOtp, getOtpData } from "../../src/utils/otpStore.js";
import { sendOtpToEmail } from "../services/emailService.js"; 


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

    // 3. Successful login
    res.status(200).json({
      message: "Login successful",
      userId: user._id,
      fullName: user.fullName,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
