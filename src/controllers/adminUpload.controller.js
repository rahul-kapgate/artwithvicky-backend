import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import Resource from "../models/Resource.model.js";
import HomeImage from "../models/HomeImage.model.js";

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


export const getAllResources = async (req, res) => {
  try {
    const { 
      fileType, 
      courseId, 
      page = 1, 
      limit = 10,
      sortBy = 'uploadedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (fileType) {
      filter.fileType = fileType;
    }
    if (courseId) {
      filter.courseId = courseId;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get resources with pagination and filtering
    const resources = await Resource.find(filter)
      .populate('courseId', 'name code') // Populate course details if needed
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination info
    const totalResources = await Resource.countDocuments(filter);
    const totalPages = Math.ceil(totalResources / limit);

    res.status(200).json({
      message: "Resources retrieved successfully",
      data: {
        resources,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalResources,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error("Failed to retrieve resources:", error);
    res.status(500).json({ 
      message: "Failed to retrieve resources", 
      error: error.message 
    });
  }
};

// Optional: Get single resource by ID
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const resource = await Resource.findById(id)
      .populate('courseId', 'name code');
    
    if (!resource) {
      return res.status(404).json({ 
        message: "Resource not found" 
      });
    }

    res.status(200).json({
      message: "Resource retrieved successfully",
      data: resource
    });

  } catch (error) {
    console.error("Failed to retrieve resource:", error);
    res.status(500).json({ 
      message: "Failed to retrieve resource", 
      error: error.message 
    });
  }
};

export const UploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { title, description } = req.body;

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "home-images", // optional: organize uploads in a folder
    });

    // Remove the file from local storage
    fs.unlinkSync(req.file.path);

    // Save metadata to MongoDB
    const image = new HomeImage({
      title,
      description,
      imageUrl: result.secure_url, // use secure URL instead of public_id
    });

    await image.save();

    res.status(200).json({
      message: "File uploaded and saved successfully",
      data: image,
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Ensure temp file is removed in case of error
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


export const getAllImages = async (req, res) => {
  try {
    const images = await HomeImage.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({
      message: "Images fetched successfully",
      data: images,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch images", error: error.message });
  }
};

