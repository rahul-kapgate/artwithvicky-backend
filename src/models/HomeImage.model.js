import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Image title is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "", // Optional: avoids storing undefined
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const HomeImage = mongoose.model("HomeImage", imageSchema); // Singular model name preferred

export default HomeImage;
