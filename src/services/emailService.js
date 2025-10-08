import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpToEmail = async (email, otp) => {
  try {

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",// ✅ You can use your custom domain later
      to: email,
      subject: "Verification Code - Artistic Vicky",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Dear User,</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color: #4f46e5;">${otp}</h1>
          <p>This code is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
          <br />
          <p>If you did not request this, please disregard this message.</p>
          <p>Best regards,<br /><strong>Artistic Vicky Team</strong></p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully via Resend:", response.id || response);
  } catch (error) {
    console.error("❌ Resend Email Send Error:", error.message);
    throw new Error("Failed to send OTP email");
  }
};
