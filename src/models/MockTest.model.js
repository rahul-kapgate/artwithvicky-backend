import mongoose from "mongoose";
import Counter from "./Counter.model.js";

const mockTestSchema = new mongoose.Schema(
  {
    mockTestNumber: {
      type: Number,
    //   required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOfTest: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    obtainedMarks: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-increment mockTestNumber before saving
mockTestSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { id: "mockTestNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.mockTestNumber = counter.seq;
  }
  next();
});

const MockTest = mongoose.model("MockTest", mockTestSchema);
export default MockTest;
