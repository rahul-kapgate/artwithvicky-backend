import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://artisticvicky.netlify.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


app.use(express.json());


app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
