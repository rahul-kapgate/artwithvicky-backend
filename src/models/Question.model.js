import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === 4;
        },
        message: "Exactly 4 options are required",
      },
    },
    correctOption: {
      type: String, // You can change to Number if using index
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    response: {
      type: String,
      required: false,
    },
    img: {
      type: String, // You can use Cloudinary or store path if uploading locally
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
