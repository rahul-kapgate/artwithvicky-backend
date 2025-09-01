import express from "express";
import { createResource, getAllResources, getResourceById, updateResourceById, deleteResourceById } from "../controllers/resource.controller.js";

const router = express.Router();

router.post("/create", createResource);
router.get("/get-all", getAllResources);
router.get("/get-by-id/:id", getResourceById);
router.put("/update-by-id/:id", updateResourceById);
router.delete("/delete-by-id/:id", deleteResourceById);

export default router;