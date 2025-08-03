import express from "express";
import {
  initiateUserSignup,
  loginUser,
  refreshAccessToken,
  verifyUserSignup,
  initiateForgotPassword,  
  verifyForgotPassword, 
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup/initiate", initiateUserSignup);
router.post("/signup/verify", verifyUserSignup);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.post("/forgot-password/initiate", initiateForgotPassword);
router.post("/forgot-password/verify", verifyForgotPassword);

router.get("/profile/:userId", getUserProfile);

export default router;
