import express from "express";
import {
  initiateUserSignup,
  loginUser,
  refreshAccessToken,
  verifyUserSignup,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup/initiate", initiateUserSignup);
router.post("/signup/verify", verifyUserSignup);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
