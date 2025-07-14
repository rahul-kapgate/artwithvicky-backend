import express from "express";
import { getAllImages } from "../controllers/adminUpload.controller.js";

const router = express.Router();

router.get("/get-images", getAllImages);

export default router;
