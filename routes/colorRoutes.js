import express from "express";
import {
  createColor,
  deleteColor,
  getColor,
  getColors,
  updateColor,
} from "../controllers/ColorController.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = express.Router();

router.post("/", isLoggedIn, isAdmin, createColor);
router.get("/", getColors);
router.get("/:id", getColor);
router.put("/:id", isLoggedIn, isAdmin, updateColor);
router.delete("/:id", isLoggedIn, isAdmin, deleteColor);

export default router;
