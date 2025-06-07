import express from "express";
import {
  initiateUserSignup,
  loginUser,
  verifyUserSignup,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup/initiate", initiateUserSignup);
router.post("/signup/verify", verifyUserSignup);
router.post("/login", loginUser);

export default router;
