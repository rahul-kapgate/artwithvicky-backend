import mongoose from "mongoose";
import Question from "../models/Question.model.js";
import MockTest from "../models/MockTest.model.js";

// GET 40 random questions globally
export const getRandomQuestions = async (req, res) => {
  try {
    const questions = await Question.aggregate([{ $sample: { size: 40 } }]);
    // const questions = await Question.find();
    console.log(questions.length)
    res.status(200).json(questions);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

// POST submit mock test result
export const submitMockTest = async (req, res) => {
  const { user, dateOfTest, totalMarks, obtainedMarks } = req.body;

  if (obtainedMarks > totalMarks) {
    return res
      .status(400)
      .json({ message: "Obtained marks cannot exceed total marks" });
  }

  try {
    const newTest = await MockTest.create({
      user,
      dateOfTest,
      totalMarks,
      obtainedMarks,
    });

    res.status(201).json({
      message: "Mock test submitted successfully",
      mockTest: newTest,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit mock test", error });
  }
};
