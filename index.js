import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ Import CORS
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminRoute from "./src/routes/admin.routes.js";
import adminUploadRoutes from "./src/routes/adminUpload.routes.js";
import mockTestRoutes from "./src/routes/mockTest.routes.js";
import imagesRoutes from "./src/routes/imgaes.routes.js"
import videoRoute from "./src/routes/video.routes.js";
import resourceRoutes from "./src/routes/resource.routes.js"; 

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
app.use(express.urlencoded({ extended: true }));


app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/admin", adminUploadRoutes);
app.use("/api/mocktest", mockTestRoutes); 
app.use("/api/images", imagesRoutes);
app.use("/api/videos", videoRoute);
app.use("/api/resources", resourceRoutes);

app.get("/", (req, res) => {
  res.send("HOME ROUTE Art with Vicky");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
