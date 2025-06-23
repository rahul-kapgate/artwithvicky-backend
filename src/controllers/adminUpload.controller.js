import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // Important for PDF and non-image files
    });

    fs.unlinkSync(req.file.path); // delete temp file

    res.status(200).json({
      message: "File uploaded successfully",
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
