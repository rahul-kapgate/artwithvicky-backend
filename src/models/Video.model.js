import mongoose from "mongoose";

const videosSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", videosSchema);

export default Video;