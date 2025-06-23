import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Resource from "../models/Resource.model.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { title, fileType, courseId } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    fs.unlinkSync(req.file.path); // delete temp file

    const resource = new Resource({
      title,
      fileType,
      courseId,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
    });

    await resource.save();

    res.status(200).json({
      message: "File uploaded and saved successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Cloudinary upload failed", error);
    res.status(500).json({ message: "Upload failed", error });
  }
};
