import redis from "../config/redisClient.js";

export const storeOtp = async (email, data) => {
  const key = `otp:${email}`;
  const value = JSON.stringify(data); // Serialize to JSON string

  // Explicitly force string storage
  await redis.set(key, value);
  await redis.expire(key, 300); // TTL: 5 mins

  console.log(`✅ OTP stored for ${email}`);
  console.log("🔐 Stored JSON string:", value);
};

export const getOtpData = async (email, otp) => {
  const key = `otp:${email}`;
  const raw = await redis.get(key);

  console.log("🔍 Raw from Redis:", raw);

  if (!raw) return null;

  let data;
  try {
    data = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch (err) {
    console.error("❌ JSON parse error:", err, "Raw:", raw);
    return null;
  }

  console.log("Parsed data:", data);
  console.log("Provided OTP:", otp);

  if (parseInt(data.otp) !== parseInt(otp)) {
    console.log("❌ OTP mismatch");
    return null;
  }

  await redis.del(key);
  console.log("✅ OTP matched. User data from Redis:", data);
  return data;
};
