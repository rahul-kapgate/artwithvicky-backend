import express from "express";
import { SaveVideo, GetAllVideos, DeleteVideo } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/save-video", SaveVideo);
router.get("/get-all-videos", GetAllVideos);
router.delete("/delete-video/:id", DeleteVideo);

export default router;