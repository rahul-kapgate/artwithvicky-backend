import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // to parse JSON body

app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});
