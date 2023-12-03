import express from "express";
const router = express.Router();
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import {
  getUser,
  loginUser,
  registerUser,
  updateShippingAddress,
} from "../controllers/UsersController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isLoggedIn, getUser);
router.post("/update/shipping", isLoggedIn, updateShippingAddress);

export default router;
