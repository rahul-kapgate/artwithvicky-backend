import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpToEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification Code - Artistic Vicky",
    text: `Dear User,

Your One-Time Password (OTP) is: ${otp}

This code is valid for 5 minutes. Please do not share it with anyone.

If you did not request this, please disregard this message.

Best regards,  
Artistic Vicky Team`,
  };

  await transporter.sendMail(mailOptions);
};
