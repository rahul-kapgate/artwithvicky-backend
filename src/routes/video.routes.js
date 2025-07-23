import express from "express";
import { SaveVideo, GetAllVideos } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/save-video", SaveVideo);
router.get("/get-all-videos", GetAllVideos);

export default router;