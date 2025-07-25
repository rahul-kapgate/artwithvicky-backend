import express from "express";
import multer from "multer";
import {
  uploadFile,
  getAllResources,
  getResourceById,
  DeleteResourceById,
  UpdateResourceById,
} from "../controllers/adminUpload.controller.js";
import fs from "fs";
import {
  UploadImage,
  deleteImageById,
  updateImageById,
} from "../controllers/adminUpload.controller.js";

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
router.post("/image-upload", upload.single("file"), UploadImage);
router.put("/images/:id", updateImageById);
router.delete("/images/:id", deleteImageById);

router.delete("/resources/:id", DeleteResourceById);
router.put("/resources/:id", UpdateResourceById);

export default router;
