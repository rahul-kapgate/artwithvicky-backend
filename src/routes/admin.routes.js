import express from "express";
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
  getAllUsers,
  assignCourses,
  removeCourses,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Protect all admin routes with authentication and admin check
router.use(authenticateToken, isAdmin);

router.get("/users", getAllUsers);
router.post("/assign-courses", assignCourses);
router.post("/remove-courses", removeCourses);

export default router;
