import express from "express";
import {
  getRandomQuestions,
  submitMockTest,
} from "../controllers/mockTest.controller.js";

const router = express.Router();

router.get("/questions", getRandomQuestions); 
router.post("/submit", submitMockTest);

export default router;
