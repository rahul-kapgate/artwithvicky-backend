import redis from "../config/redisClient.js";

export const storeOtp = async (email, data) => {
  console.log("Storing OTP for email:", email);
  const key = `otp:${email}`;
  const value = JSON.stringify(data); // Serialize to JSON string

  // Explicitly force string storage
  await redis.set(key, value);
  await redis.expire(key, 300); // TTL: 5 mins


};

export const getOtpData = async (email, otp) => {
  console.log("Getting OTP data for email:", email);
  const key = `otp:${email}`;
  const raw = await redis.get(key);


  if (!raw) return null;

  let data;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (err) {
    console.error("❌ JSON parse error:", err, "Raw:", raw);
    return null;
  }



  if (parseInt(data.otp) !== parseInt(otp)) {
    console.log("❌ OTP mismatch");
    return null;
  }

  await redis.del(key);
  console.log("✅ OTP matched. User data from Redis:", data);
  return data;
};
