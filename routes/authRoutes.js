import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getAllUser,
  getAllAdmin,
  updateStatus,
  deleteUser,
  updateUser,
  getUserByslug,
  deleteUserBlog,
  verifyEmail
} from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.patch("/updateUser/:id",updateUser);
router.patch("/deleteSpecificuserBLog/:id", deleteUserBlog);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.get("/getAllUsers", getAllUser);
router.get("/singleUserbyslug/:slug", getUserByslug);
router.get("/getAllAdmin", getAllAdmin);
router.patch('/toggled/:id', updateStatus);
router.delete('/deleteUser/:id', deleteUser);
router.get("/verify-email", verifyEmail);

export default router;
