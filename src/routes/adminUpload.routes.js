import express from "express";
import multer from "multer";
import {
  uploadFile,
  getAllResources,
  getResourceById,
} from "../controllers/adminUpload.controller.js";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer with file size limit and storage
const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/admin/upload
router.post("/upload", upload.single("file"), uploadFile);
router.get("/resources", getAllResources);
router.get("/resources/:id", getResourceById);

export default router;
