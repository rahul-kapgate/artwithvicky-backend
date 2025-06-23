// models/Resource.js
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileType: {
    type: String,
    enum: ["notes", "ebook", "pyq", "session"],
    default: "notes",
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  cloudinaryUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Resource", resourceSchema);
